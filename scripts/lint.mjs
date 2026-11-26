/**
 * Zero-dependency static syntax & quality linter for IdeaQuest.
 * Runs `node --check` on every JS/MJS file and checks HTML/CSS/JS invariants.
 */

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const errors = [];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'dist') continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk(ROOT);
const jsFiles = allFiles.filter((f) => ['.js', '.mjs'].includes(extname(f)));
const cssFiles = allFiles.filter((f) => extname(f) === '.css');
const htmlFiles = allFiles.filter((f) => extname(f) === '.html');

// 1. Node syntax check on every JS/MJS module
for (const file of jsFiles) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (err) {
    errors.push(`Syntax error in ${file}:\n${err.stderr?.toString() || err.message}`);
  }
}

// 2. Check for leftover debug statements or placeholder handlers in src/
for (const file of jsFiles.filter((f) => f.includes('/src/'))) {
  const src = readFileSync(file, 'utf8');
  if (/\bconsole\.log\s*\(/.test(src)) {
    errors.push(`Unexpected console.log in ${file}`);
  }
  if (/\b(TODO|FIXME|XXX)\b/.test(src)) {
    errors.push(`Unresolved TODO/FIXME marker found in ${file}`);
  }
}

// 3. Basic balanced braces check on CSS files
for (const file of cssFiles) {
  const css = readFileSync(file, 'utf8');
  const openCount = (css.match(/\{/g) || []).length;
  const closeCount = (css.match(/\}/g) || []).length;
  if (openCount !== closeCount) {
    errors.push(`Unbalanced CSS braces in ${file}: {=${openCount}, }=${closeCount}`);
  }
  if (!css.includes('prefers-reduced-motion') && file.endsWith('main.css')) {
    errors.push(`Missing prefers-reduced-motion support in ${file}`);
  }
}

// 4. Verify index.html basic structure & accessibility landmarks
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  if (!html.includes('lang="id"')) {
    errors.push(`Missing lang="id" attribute in ${file}`);
  }
  if (!html.includes('viewport')) {
    errors.push(`Missing viewport meta tag in ${file}`);
  }
}

if (errors.length > 0) {
  console.error(`Lint failed with ${errors.length} issue(s):\n\n${errors.join('\n\n')}`);
  process.exit(1);
}

console.log(`Lint passed! Checked ${jsFiles.length} JS/MJS files, ${cssFiles.length} CSS files, ${htmlFiles.length} HTML files.`);

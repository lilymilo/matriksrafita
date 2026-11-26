/**
 * Production build script for IdeaQuest 2.0 (with Three.js vendor bundling).
 * Produces a self-contained, deployable `dist/` directory:
 *   - dist/index.html (with local Three.js import map)
 *   - dist/assets/styles.css (combined tokens + main stylesheet)
 *   - dist/assets/app.js (clean ES module bundle importing `three` + `OrbitControls`)
 *   - dist/vendor/three/ (three.module.js, three.core.js, controls/OrbitControls.js)
 */

import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');

rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, 'assets'), { recursive: true });
mkdirSync(join(DIST, 'vendor/three/controls'), { recursive: true });

// 1. Copy minimal required Three.js ESM vendor files
copyFileSync(
  join(ROOT, 'node_modules/three/build/three.module.js'),
  join(DIST, 'vendor/three/three.module.js')
);
copyFileSync(
  join(ROOT, 'node_modules/three/build/three.core.js'),
  join(DIST, 'vendor/three/three.core.js')
);
copyFileSync(
  join(ROOT, 'node_modules/three/examples/jsm/controls/OrbitControls.js'),
  join(DIST, 'vendor/three/controls/OrbitControls.js')
);

// 2. Combine CSS
const tokensCss = readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8');
const mainCss = readFileSync(join(ROOT, 'src/styles/main.css'), 'utf8');
const combinedCss = `${tokensCss}\n\n${mainCss}`;
writeFileSync(join(DIST, 'assets/styles.css'), combinedCss, 'utf8');

// 3. Bundle application modules cleanly as a single ES module (preserving dynamic `import('three')`)
const moduleOrder = [
  'src/data/ideas.js',
  'src/utils/matrix.js',
  'src/state/store.js',
  'src/components/Icons.js',
  'src/components/IdeaSpace3D.js',
  'src/components/OverviewHero.js',
  'src/components/SummaryStats.js',
  'src/components/PriorityMatrix.js',
  'src/components/IdeaInspector.js',
  'src/components/DecisionLenses.js',
  'src/components/IdeaExplorer.js',
  'src/components/FinalSelection.js',
  'src/components/CriticalAnalysis.js',
  'src/components/PresentationMode.js',
  'src/components/ExportControls.js',
  'src/components/IdeaQuestPage.js',
  'src/main.js',
];

const sharedEscapeFn = `
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
`;

function stripLocalImports(code, relPath) {
  let out = code.replace(/^import\s+[\s\S]*?from\s+['"]\.[^'"]+['"];?\s*$/gm, '');
  out = out.replace(/^export\s+(async\s+function|function|const|let|var)\s+/gm, '$1 ');
  out = out.replace(/function escapeHtml\(value\)\s*\{[\s\S]*?\n\}/g, '// uses shared escapeHtml');
  return `// --- ${relPath} ---\n${out.trim()}\n`;
}

const bundledParts = [sharedEscapeFn];
for (const relPath of moduleOrder) {
  const raw = readFileSync(join(ROOT, relPath), 'utf8');
  bundledParts.push(stripLocalImports(raw, relPath));
}

const bundledJs = `${bundledParts.join('\n')}\n`;
writeFileSync(join(DIST, 'assets/app.js'), bundledJs, 'utf8');

// 4. Generate production dist/index.html with self-contained local vendor importmap
const srcHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');
const prodHtml = srcHtml
  .replace(
    /<link rel="stylesheet" href="\.\/src\/styles\/tokens\.css" \/>\s*<link rel="stylesheet" href="\.\/src\/styles\/main\.css" \/>/,
    '<link rel="stylesheet" href="./assets/styles.css" />'
  )
  .replace(
    '"three": "./node_modules/three/build/three.module.js",\n        "three/addons/": "./node_modules/three/examples/jsm/"',
    '"three": "./vendor/three/three.module.js",\n        "three/addons/": "./vendor/three/"'
  )
  .replace(
    '<script type="module" src="./src/main.js"></script>',
    '<script type="module" src="./assets/app.js"></script>'
  );

writeFileSync(join(DIST, 'index.html'), prodHtml, 'utf8');

const cssKb = (Buffer.byteLength(combinedCss, 'utf8') / 1024).toFixed(1);
const jsKb = (Buffer.byteLength(bundledJs, 'utf8') / 1024).toFixed(1);
console.log(`IdeaQuest 2.0 build complete -> dist/ (styles.css: ${cssKb} KB, app.js: ${jsKb} KB + Three.js vendor modules)`);

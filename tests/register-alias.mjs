import { Buffer } from 'node:buffer';
import { register } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const rootDir = process.cwd();

const hookSource = `
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const rootDir = ${JSON.stringify(rootDir)};

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const rel = specifier.slice(2);
    const base = path.join(rootDir, rel);
    for (const ext of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) {
      const candidate = base + ext;
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return nextResolve(pathToFileURL(candidate).href, context);
      }
    }
  }
  return nextResolve(specifier, context);
}
`;

register(
  `data:text/javascript;base64,${Buffer.from(hookSource).toString('base64')}`,
  pathToFileURL(path.join(rootDir, 'package.json')),
);

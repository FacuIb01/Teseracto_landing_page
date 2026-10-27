import { copyFile, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const root = import.meta.dirname;
const output = resolve(root, 'dist');
const files = [
  'index.html', 'src/main.js', 'src/style.css', 'src/contact.js',
  'src/viewer.js', 'src/viewer.css', 'src/tesseract.js', 'src/math4d.js',
];
for (const file of files) {
  const target = resolve(output, file);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(resolve(root, file), target);
}
// Only ship assets used by the landing; keep design drafts and original alternatives local.
for (const file of ['teseracto-logo-v3.png', 'teseracto-logo-dark-background-v1.png', 'lacoste-original.png']) {
  await mkdir(resolve(output, 'assets/branding'), { recursive: true });
  await copyFile(resolve(root, 'assets/branding', file), resolve(output, 'assets/branding', file));
}
for (const folder of ['fonts', 'illustrations']) await cp(resolve(root, 'assets', folder), resolve(output, 'assets', folder), { recursive: true });

// Retain the separate 3D viewer; the landing never downloads Three.js.
const vendor = [
  ['node_modules/three/build/three.module.min.js', 'vendor/three/three.module.min.js'],
  ['node_modules/three/build/three.core.min.js', 'vendor/three/three.core.min.js'],
  ['node_modules/three/examples/jsm/controls/OrbitControls.js', 'vendor/three/addons/controls/OrbitControls.js'],
  ['node_modules/three/LICENSE', 'vendor/three/LICENSE'],
];
for (const [source, destination] of vendor) {
  await mkdir(dirname(resolve(output, destination)), { recursive: true });
  await copyFile(resolve(root, source), resolve(output, destination));
}
const viewer = (await readFile(resolve(root, 'previews/visor.html'), 'utf8')).replace(
  /<script type="importmap">[\s\S]*?<\/script>/,
  '<script type="importmap">{"imports":{"three":"../vendor/three/three.module.min.js","three/addons/":"../vendor/three/addons/"}}</script>',
);
await mkdir(resolve(output, 'previews'), { recursive: true });
await writeFile(resolve(output, 'previews/visor.html'), viewer);
await writeFile(resolve(output, '.nojekyll'), '');
console.log('Landing generada en dist/. Recursos locales y rutas relativas, compatibles con GitHub Pages.');

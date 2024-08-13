import * as fs from 'node:fs/promises';
import * as esbuild from 'esbuild';
import heraPlugin from '@danielx/hera/esbuild-plugin';
import civetPlugin from '@danielx/civet/dist/esbuild-plugin.js';

await fs.mkdir('dist/img', { recursive: true });
await Promise.all([
    esbuild.build({
        entryPoints: ['src/index.civet'],
        bundle: true,
        platform: 'browser',
        outfile: 'dist/index.js',
        plugins: [heraPlugin(), civetPlugin()],
        minify: true,
    }),
    fs.readdir('img').then(arr =>
        Promise.all(arr.map(el => fs.copyFile(`img/${el}`, `dist/img/${el}`)))
    ),
    fs.copyFile('index.html', 'dist/index.html'),
    fs.copyFile('index.css', 'dist/index.css'),
]);

import * as fs from 'node:fs/promises';
import * as esbuild from 'esbuild';
import yaml from 'js-yaml';
import heraPlugin from '@danielx/hera/esbuild-plugin';
import civetPlugin from '@danielx/civet/esbuild';

async function compileYaml(filename) {
    const file = await fs.readFile(filename, { encoding: 'utf-8' });
    const object = yaml.load(file);
    const json = JSON.stringify(object);
    await fs.writeFile(filename.replace(/\.ya?ml$/, '.json'), json);
}

await Promise.all([
    fs.mkdir('dist/img', { recursive: true }),
    compileYaml('src/translation/dictionary.yml'),
]);
await Promise.all([
    esbuild.build({
        entryPoints: ['src/index.civet'],
        bundle: true,
        platform: 'browser',
        outfile: 'dist/index.js',
        plugins: [
            heraPlugin(),
            civetPlugin({
                parseOptions: { comptime: true },
                ts: 'preserve',
            }),
        ],
        minify: true,
        sourcemap: true,
    }),
    fs.readdir('img').then(arr =>
        Promise.all(arr.map(el => fs.copyFile(`img/${el}`, `dist/img/${el}`)))
    ),
    fs.copyFile('index.html', 'dist/index.html'),
    fs.copyFile('index.css', 'dist/index.css'),
]);

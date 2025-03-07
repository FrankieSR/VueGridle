import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            outputDir: 'dist',
            staticImport: true,
            skipDiagnostics: false,
        }),
        visualizer({ open: true, filename: 'stats.html' }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: '@vueblocks/vueblocks',
            fileName: (format) => `vueblocks.${format}.js`,
            formats: ['es', 'cjs', 'umd'],
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
                exports: 'named',
            },
        },
        sourcemap: true,
        minify: 'terser',
        target: 'esnext',
    },
});
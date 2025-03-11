import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            outputDir: 'dist',
            staticImport: true,
            skipDiagnostics: false,
            entryRoot: path.resolve(__dirname, 'src'),
            include: ['src/index.ts', 'src/**/*.ts', 'src/**/*.vue'],
            exclude: ['src/App.vue', 'src/main.ts', '**/*.spec.ts', '**/*.test.ts'],
            rollupTypes: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'VueGridle',
            fileName: (format) => `vuegridle.${format}.js`,
            formats: ['es', 'cjs', 'umd'],
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
                exports: 'named',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') return 'style.css';
                    if (assetInfo.name === 'favicon.ico') return undefined;
                    return assetInfo.name;
                },
            },
        },
        sourcemap: true,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                passes: 2,
            },
            mangle: true,
        },
        target: 'esnext',
        emptyOutDir: true,
    },
});

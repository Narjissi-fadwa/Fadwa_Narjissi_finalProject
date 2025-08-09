import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'], // Changed .tsx to .jsx
            ssr: 'resources/js/ssr.jsx', // Changed .tsx to .jsx
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        port: 5173,
        host: 'localhost',
    },
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
});


  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import tailwindcss from '@tailwindcss/vite';
  import path from 'path';
  import { writeMetadataPages } from './scripts/page-metadata.mjs';

  export default defineConfig({
    base: '/',
    plugins: [react(), tailwindcss(), {
      name: 'page-metadata',
      apply: 'build',
      async writeBundle(output) {
        if (!output.dir) throw new Error('SEO-Build benötigt ein Ausgabeverzeichnis.');
        await writeMetadataPages(output.dir);
      },
    }],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });

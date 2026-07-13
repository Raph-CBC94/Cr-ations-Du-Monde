import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const isDev = process.env.NODE_ENV !== 'production';

// In dev (Replit), PORT and BASE_PATH are required.
// In production build (Render), they are not needed.
const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 3000;

const basePath = process.env.BASE_PATH ?? '/';

const plugins = [react(), tailwindcss()];

if (isDev) {
  plugins.push(
    (await import('@replit/vite-plugin-runtime-error-modal')).default(),
  );

  if (process.env.REPL_ID !== undefined) {
    plugins.push(
      await import('@replit/vite-plugin-cartographer').then((m) =>
        m.cartographer({
          root: path.resolve(import.meta.dirname, '..'),
        }),
      ),
      await import('@replit/vite-plugin-dev-banner').then((m) =>
        m.devBanner(),
      ),
    );
  }
}

export default defineConfig({
  base: basePath,
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});

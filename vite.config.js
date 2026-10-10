import { defineConfig } from 'vite';

// Static single-page app. No backend. Builds to dist/ for the public repo.
export default defineConfig({
  server: {
    open: true,
  },
  build: {
    target: 'es2022',
  },
});

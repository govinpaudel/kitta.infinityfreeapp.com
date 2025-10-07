import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/lrims': {
        target: 'http://10.7.252.13',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lrims/, ''),
      },
    },
  },
});

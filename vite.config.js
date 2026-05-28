
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // Alias para o código fonte em src/
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), 'src'),
        }
      }
    };
});

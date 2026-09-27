import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, process.cwd(), 'VITE_');
  if (!VITE_API_URL) throw new Error('VITE_API_URL must point to the API before starting Vite.');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    server: {
      port: 5173,
      strictPort: true,
    },
  };
});

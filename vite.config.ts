// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api/v1': {
          target: env.VITE_API_TARGET,
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('🚀 Proxying request to:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('📨 Received response:', proxyRes.statusCode, req.url);
            });
          },
        }
      },
    },
  }
})
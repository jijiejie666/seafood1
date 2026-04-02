import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // 当请求以 /api 开头时，转发到后端服务器
      '/api': {
        target: 'http://localhost:8080', 
        changeOrigin: true,
        // 如果后端接口本身没有 /api 前缀，可以开启路径重写
        // rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  }
})

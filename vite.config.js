import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
// 使用vite插件编辑vue3
export default defineConfig({
  // 使用uni插件
  plugins: [uni()],
  // 打包时操作
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除console
        drop_console: false,
        // 移除debugger
        drop_debugger: true,
      },
    },
  },
// 代理配置
  server: {
    port: 5173,
    proxy: {
      '/api/': {
        target: "http://127.0.0.1:8078",
        ws: true,
        // 是否跨域
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
});

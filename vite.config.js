import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import compression from 'vite-plugin-compression'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { resolve } from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // Gzip压缩
    compression({
      algorithm: 'gzip',
      threshold: 10240, // 仅压缩大于10KB的文件
      deleteOriginFile: false
    }),
    // 图片优化
    ViteImageOptimizer({
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
                cleanupIDs: {
                  minify: false,
                  remove: false
                }
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // 路径别名
    },
    extensions: [".js", ".json", ".ts"], // 使用路径别名时想要省略的后缀名，可以自己 增减
  },
  server:{
    port:9421,
    host:'0.0.0.0'
  },
  build: {
    outDir: 'dist', // 打包输出目录
    assetsDir: 'assets', // 静态资源输出目录
    rollupOptions: {

      output: {
        // 细化资源输出目录
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|gif|svg|webp/i.test(extType)) {
            extType = 'images';
          } else if (/woff|woff2|ttf|eot/i.test(extType)) {
            extType = 'fonts';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',

        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia']
        }
      },
      cssCodeSplit: true, // CSS代码分割
      sourcemap: false // 生产环境不生成sourcemap
    }
  }
})

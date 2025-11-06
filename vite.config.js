import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import compression from 'vite-plugin-compression'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { resolve } from "path";
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import fs from 'fs';
import path from 'path';
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
      // 设置fallback以处理缺少依赖的情况
      skipLarger: true,
      // 忽略优化错误，继续构建
      handleError: (error) => {
        console.warn('图片优化出错，继续构建:', error.message);
        return false; // 不抛出错误，继续构建
      },
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
      },
      // 当缺少优化器依赖时的处理
      png: {
        // 禁用png优化，因为需要sharp
        enabled: false,
      },
      jpeg: {
        // 禁用jpeg优化，因为需要sharp
        enabled: false,
      },
      webp: {
        // 禁用webp优化，因为需要sharp
        enabled: false,
      },
      gif: {
        // 禁用gif优化，因为需要sharp
        enabled: false,
      }
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss:{
        api: 'modern-compiler'
      }
    }
  },
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
        // 自定义chunk文件名格式
        chunkFileNames: `assets/js/[name]-[hash]${Date.now()}.js`,
        entryFileNames: `assets/js/[name]-[hash]${Date.now()}.js`,
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia']
        },
        // 正确的writeBundle钩子位置
        plugins: [
          {
            name: 'write-version-file',
            writeBundle() {
              const version = new Date().getTime();
              // 直接写入到dist目录
              const versionPath = path.resolve(__dirname, 'dist/version.json');
              // 确保dist目录存在
              if (!fs.existsSync(path.dirname(versionPath))) {
                fs.mkdirSync(path.dirname(versionPath), { recursive: true });
              }
              fs.writeFileSync(versionPath, JSON.stringify({ version }));
              console.log('版本号已更新为:', version);
              console.log('版本文件已写入:', versionPath);
            }
          }
        ]
      },
      cssCodeSplit: true, // CSS代码分割
      sourcemap: false // 生产环境不生成sourcemap
    }
  }
})

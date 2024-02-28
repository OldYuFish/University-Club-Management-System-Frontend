import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        eslintrc: {
          enabled: true,
          filepath: './src/.eslintrc-auto-import.json',
        },
        dts: './src/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        dts: './src/components.d.ts',
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        vue: resolve('./node_modules/vue'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/element-variables.scss" as *;',
        },
      },
    },
  };
});

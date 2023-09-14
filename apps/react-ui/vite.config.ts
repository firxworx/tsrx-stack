/// <reference types="vitest" />
import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

import { visualizer } from 'rollup-plugin-visualizer'

/**
 * Set flag to `true` to emit 'stats.html' in project root on build.
 * Tip: open the file from wsl2 terminal via: `explorer.exe stats.html`
 * @see https://github.com/btd/rollup-plugin-visualizer
 */
const RUN_ROLLUP_PLUGIN_VISUALIZER = false

export default defineConfig({
  cacheDir: '../../node_modules/.vite/react-ui',

  server: {
    port: 4200,
    host: 'localhost',
    cors: {
      origin: ['http://localhost:4200'],
      credentials: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3939',
        changeOrigin: true,
        secure: false, // do not verify ssl certificate if in play
      },
    },

    // uncomment if using https and provide certificates
    // https: {
    //   key: fs.readFileSync(path.resolve(workspaceRoot, 'certs/vite.key')),
    //   cert: fs.readFileSync(path.resolve(workspaceRoot, 'certs/vite.crt')),
    // },
  },

  preview: {
    port: 4300,
    host: 'localhost',
    cors: {
      origin: ['https://localhost:4300'], //['http://127.0.0.1:4300'],
      credentials: true,
    },
  },

  plugins: [
    react(),
    nxViteTsPaths(),

    RUN_ROLLUP_PLUGIN_VISUALIZER
      ? (visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          emitFile: false,

          // if set the file will be generated in the app's dist directory
          // filename: 'stats-react-ui.html',
        }) as PluginOption)
      : undefined,
  ].filter(Boolean),

  // https://rollupjs.org/configuration-options/
  build: {
    rollupOptions: {
      treeshake: true,
    },
  },

  // uncomment if using workers
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})

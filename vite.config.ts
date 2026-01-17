import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isExtension = mode === 'extension'

  return {
    plugins: [react()],
    base: isExtension ? './' : '/',
    build: isExtension ? {
      outDir: 'extension',
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'popup.html'),
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
        },
      },
    } : undefined,
  }
})

import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { scanContent } from './scripts/generate-content.mjs'

/**
 * Keeps src/generated/content.json in sync while the dev server is running,
 * so dropping a new image (or a whole new folder) into public/portfolio
 * hot-reloads the site without restarting anything.
 */
function portfolioContent(): Plugin {
  return {
    name: 'design-forge:portfolio-content',
    configureServer(server) {
      const watched = fileURLToPath(new URL('./public/portfolio', import.meta.url))
      server.watcher.add(watched)

      let queued: ReturnType<typeof setTimeout> | undefined
      const resync = (file: string) => {
        if (!file.includes('portfolio')) return
        clearTimeout(queued)
        queued = setTimeout(() => {
          const { changed } = scanContent({ quiet: true })
          if (changed) {
            server.config.logger.info('  \x1b[38;5;208m▸\x1b[0m portfolio content updated')
            server.ws.send({ type: 'full-reload' })
          }
        }, 150)
      }

      server.watcher.on('add', resync)
      server.watcher.on('unlink', resync)
      server.watcher.on('addDir', resync)
      server.watcher.on('unlinkDir', resync)
      server.watcher.on('change', resync)
    },
  }
}

export default defineConfig({
  // Relative base -> the built site works from any folder (GitHub Pages, Netlify, a USB stick).
  base: './',
  plugins: [react(), tailwindcss(), portfolioContent()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        // Keep the animation runtime out of the entry chunk so first paint is lean.
        manualChunks(id: string) {
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) return 'motion'
          if (id.includes('node_modules/react-router')) return 'router'
        },
      },
    },
  },
})

import { useState } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import SmoothScroll from '@/components/SmoothScroll'
import Backdrop from '@/components/Backdrop'
import Nav from '@/components/Nav'
import Preloader from '@/components/Preloader'
import ScrollProgress from '@/components/ScrollProgress'
import Home from '@/pages/Home'
import CategoryPage from '@/pages/CategoryPage'
import NotFound from '@/pages/NotFound'

/** Routes wrapped in a wipe so navigation reads as one continuous piece. */
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CategoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    // HashRouter + a relative Vite base means the built site drops into any
    // static host (GitHub Pages sub-path included) with no server config.
    <HashRouter>
      <SmoothScroll>
        <Backdrop />
        <ScrollProgress />
        <Preloader onDone={() => setReady(true)} />

        <div className="relative" style={{ opacity: ready ? 1 : 0, transition: 'opacity .6s ease .1s' }}>
          <Nav />
          <AnimatedRoutes />
        </div>
      </SmoothScroll>
    </HashRouter>
  )
}

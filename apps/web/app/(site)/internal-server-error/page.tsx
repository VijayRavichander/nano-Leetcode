"use client";

import { motion } from "framer-motion";

function App() {
  return (
    <div className="app-theme app-page flex min-h-screen flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="max-w-lg text-center text-2xl font-medium tracking-[-0.02em] text-[var(--app-text)]"
      >
        Internal server error. Please try again later.
      </motion.div>
      <p className="mt-4 text-sm text-[var(--app-muted)]">
        If the issue persists, refresh the page or return to the problems list.
      </p>
    </div>
  );
}

export default App;

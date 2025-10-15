"use client"
import { motion } from "framer-motion";


function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#111111] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center text-white text-2xl font-thin"
      >
        Internal Server Error. Please try again later.
      </motion.div>
    </div>
  );  
}

export default App;
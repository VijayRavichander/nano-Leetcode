import { motion, AnimatePresence } from "framer-motion";

const Loader = ({
  colorClass = "text-[var(--app-accent)]",
}: {
  colorClass?: string;
}) => {
  return (
    <div className="app-theme app-page flex min-h-screen flex-col items-center justify-center">
      <AnimatePresence>
        <div style={{ perspective: "150px" }}>
          <motion.div
            className={colorClass}
            key={colorClass}
            style={{
              width: 40,
              aspectRatio: "1",
              backgroundColor: "currentColor",
            }}
            exit={{ opacity: 0 }}
            animate={{
              rotateX: [0, 180, 180],
              rotateY: [0, 0, 180],
              opacity: 1,
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </AnimatePresence>
    </div>
  );
};

export default Loader;

import { motion, AnimatePresence } from "framer-motion";

export default function PageTransition({ show, text }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
  key="transition"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 1.1 }}
  transition={{ duration: 0.6, ease: "easeInOut" }}
  className="fixed inset-0 flex items-center justify-center bg-[#eeb626] text-white text-5xl font-bold z-[9999]"
>
  <motion.span
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
  >
    {text}
  </motion.span>
</motion.div>

      )}
    </AnimatePresence>
  );
}

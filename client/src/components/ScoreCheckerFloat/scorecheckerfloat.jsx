import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ScoreCheckerFloat = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.8, duration: 0.6, type: "spring", stiffness: 160 }}
      className="fixed right-5 bottom-20 z-50"
    >
      <Link to="/score-checker">
        <motion.div
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 280 }}
          className="relative cursor-pointer select-none"
        >
          {/* Glow */}
          <div className="absolute -inset-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-[16px] opacity-60 blur-[8px]" />

          {/* Card */}
          <div className="relative bg-gradient-to-br from-[#2d1b69] via-[#1a0f4e] to-[#0f0a2e] rounded-[14px] border border-white/10 overflow-hidden shadow-2xl px-4 py-2.5 flex items-center gap-2.5">

            {/* shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/6 to-transparent -skew-x-12 pointer-events-none"
              initial={{ x: "-130%" }}
              animate={{ x: "230%" }}
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 1, ease: "easeInOut" }}
            />

            <img src="/logo.png" alt="ACME" className="h-6 w-6 object-contain rounded-full shrink-0" />

            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent text-[12px] font-black tracking-tight whitespace-nowrap">
              ACME Score Analyser
            </span>

          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ScoreCheckerFloat;
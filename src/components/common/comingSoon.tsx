import { motion } from "framer-motion";

export default function ComingSoon({
  title = "Coming Soon",
  description = "We're working on this feature. It'll be available shortly.",
  showSpinner = true,
  hint="",
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        {/* Animated Icon */}
        {showSpinner && (
          <motion.div
            className="flex justify-center mb-6"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full" />
          </motion.div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h1>

        {/* Description */}
        <p className="text-gray-500 mb-4">{description}</p>

        {/* Optional Hint */}
        {hint && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-400"
          >
            {hint}
          </motion.p>
        )}

        {/* Pulse Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">
          <motion.span
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <span>In progress</span>
        </div>
      </motion.div>
    </div>
  );
}

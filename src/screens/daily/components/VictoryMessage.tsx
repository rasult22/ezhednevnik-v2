import { motion } from 'framer-motion';

/**
 * VictoryMessage - Glassmorphism celebration when all 3 main tasks completed
 */
export function VictoryMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
      className="my-6"
    >
      <div className="relative overflow-hidden rounded-glass-lg p-8 text-center bg-gradient-to-r from-accent-emerald/20 via-accent-cyan/20 to-accent-blue/20 backdrop-blur-glass border border-success/30 shadow-glow-success">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-emerald/10 via-accent-cyan/10 to-accent-blue/10 animate-gradient-bg" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative text-6xl mb-4"
        >
          <span className="drop-shadow-lg">🎉</span>
        </motion.div>

        <h2 className="relative text-3xl font-bold gradient-text-cool mb-3">
          Главные 20% выполнены
        </h2>

        <p className="relative text-xl text-text-primary font-medium">
          Победа зафиксирована
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative mt-6 text-text-secondary text-sm"
        >
          <p>
            Вы сфокусировались на самом важном и достигли результата.
            <br />
            Остальные задачи — опционально.
          </p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-accent-emerald/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-accent-cyan/30 to-transparent rounded-full blur-3xl" />
      </div>
    </motion.div>
  );
}

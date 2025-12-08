import { motion } from 'framer-motion';

/**
 * VictoryMessage - Celebration message when all 3 main tasks are completed
 *
 * Features:
 * - Animated entrance (fade + scale)
 * - Green gradient background
 * - Large, bold text
 * - Permanent display (doesn't auto-hide)
 *
 * Philosophy:
 * - Reinforces completion of the critical 20%
 * - Creates positive association with achievement
 * - Visual reward for focused execution
 */
export function VictoryMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
      className="my-6"
    >
      <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-lg p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-3">
          Главные 20% на сегодня выполнены
        </h2>

        <p className="text-xl text-green-50 font-medium">
          Победа зафиксирована.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-green-100 text-sm"
        >
          <p>
            Вы сфокусировались на самом важном и достигли результата.
            <br />
            Остальные задачи — опционально.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

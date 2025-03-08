import { motion } from 'framer-motion';

interface ProductHealthBarProps {
  score: number; // Score from 0-100
}

const ProductHealthBar = ({ score }: ProductHealthBarProps) => {
  // Ensure score is between 0-100
  const safeScore = Math.max(0, Math.min(100, score));

  // Calculate color based on score
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green';
    if (score >= 60) return 'text-yellow';
    if (score >= 40) return 'text-orange';
    return 'text-red';
  };

  // Get text description based on score
  // const getHealthText = (score: number) => {
  //   if (score >= 80) return 'Very Healthy';
  //   if (score >= 60) return 'Healthy';
  //   if (score >= 40) return 'Moderately Healthy';
  //   return 'Less Healthy';
  // };

  return (
    <div className="w-full py-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-bold">Health Score</span>
        <span className={`font-bold ${getColor(safeScore)}`}>{safeScore}/100</span>
      </div>

      <div className="relative h-6 overflow-hidden rounded-full">
        {/* Background gradient */}
        <div className="from-red via-yellow to-green absolute inset-0 h-full w-full bg-gradient-to-r"></div>

        {/* Overlay to create focused effect */}
        <div className="bg-dark-900 absolute inset-0 h-full w-full opacity-50"></div>

        {/* Arrow indicator */}
        <motion.div
          className="absolute top-0 h-6 w-4"
          initial={{ left: `calc(${safeScore}% - 8px)`, opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ left: `calc(${safeScore}% - 8px)` }}
        >
          <svg
            viewBox="0 0 16 24"
            fill="currentColor"
            className={`${getColor(safeScore)}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 0L16 8H0L8 0Z" />
            <rect x="6" y="8" width="4" height="16" />
          </svg>
        </motion.div>
      </div>

      <div className="mt-1 flex justify-between text-xs">
        <span className="text-red">Less Healthy</span>
        <span className={`font-medium ${getColor(safeScore)}`}>Healthy</span>
        <span className="text-green">Very Healthy</span>
      </div>
    </div>
  );
};

export default ProductHealthBar;

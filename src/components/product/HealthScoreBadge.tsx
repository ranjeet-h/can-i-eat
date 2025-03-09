import { cx } from '../../utils/cn';

interface HealthScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const HealthScoreBadge = ({ 
  score, 
  size = 'md', 
  showText = false 
}: HealthScoreBadgeProps) => {
  // Ensure score is between 0-100
  const safeScore = Math.max(0, Math.min(100, score));
  
  // Get color class based on score
  const getScoreColor = () => {
    if (safeScore >= 80) return 'bg-green text-dark-950';
    if (safeScore >= 60) return 'bg-yellow text-dark-950';
    if (safeScore >= 40) return 'bg-orange text-dark-950';
    return 'bg-red text-dark-950';
  };
  
  // Get text description
  const getScoreText = () => {
    if (safeScore >= 80) return 'Excellent';
    if (safeScore >= 60) return 'Good';
    if (safeScore >= 40) return 'Fair';
    return 'Poor';
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base'
  };

  return (
    <div className="flex items-center">
      <div 
        className={cx(
          'flex items-center justify-center rounded-full font-bold shadow-md', 
          getScoreColor(),
          sizeClasses[size]
        )}
        title={`Health Score: ${safeScore}/100`}
      >
        {safeScore}
      </div>
      
      {showText && (
        <span className="ml-2 text-sm font-medium">{getScoreText()}</span>
      )}
    </div>
  );
};

export default HealthScoreBadge; 
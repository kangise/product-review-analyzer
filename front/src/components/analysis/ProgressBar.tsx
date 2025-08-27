import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '../ui/progress';
import { ProgressBarProps } from '../../types/analysis';

const colorClasses = {
  green: 'bg-green-500',
  blue: 'bg-blue-500', 
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'blue',
  size = 'md',
  showLabel = true,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className="text-sm font-medium text-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      
      <div className={`w-full bg-muted rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.1 
          }}
        />
      </div>
    </div>
  );
};

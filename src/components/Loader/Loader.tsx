import React from 'react';
import styles from './loader.module.scss';

export interface LoaderProps {
  className?: string;
  color?: string;
  size?: number;
}

export const Loader: React.FC<LoaderProps> = ({ className, color = '#3e7bfa', size = 20 }) => {
  return (
    <div className={className}>
      <svg viewBox='0 0 50 50' width={size} height={size} color={color} className={styles.Icon}>
        <circle
          className={styles.path}
          cx='25'
          cy='25'
          r='20'
          stroke={color}
          strokeWidth='5'
          fill='none'
        />
      </svg>
    </div>
  );
};

import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`${styles.skeleton} ${className}`}>
      <div className={styles.skeleton__image}></div>
      <div className={styles.skeleton__content}>
        <div className={styles.skeleton__title}></div>
        <div className={styles.skeleton__text}></div>
        <div className={`${styles.skeleton__text} ${styles['skeleton__text--short']}`}></div>
        <div className={styles.skeleton__meta}></div>
      </div>
    </div>
  );
}

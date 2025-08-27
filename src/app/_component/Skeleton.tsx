import React from 'react';
import '@/app/style/ui/skeleton.scss';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`skeleton ${className}`}>
      <div className="skeleton__image"></div>
      <div className="skeleton__content">
        <div className="skeleton__title"></div>
        <div className="skeleton__text"></div>
        <div className="skeleton__text skeleton__text--short"></div>
        <div className="skeleton__meta"></div>
      </div>
    </div>
  );
}

import * as React from 'react';
import clsx from 'clsx';
import '@/app/style/ui/badge.scss';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'medium',
  className,
  dot = false,
  removable = false,
  onRemove,
  ...props
}: BadgeProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <span
      className={clsx(
        'badge',
        `badge--${variant}`,
        `badge--${size}`,
        {
          'badge--with-dot': dot,
          'badge--removable': removable,
        },
        className,
      )}
      {...props}
    >
      {dot && <span className="badge__dot" />}
      <span className="badge__content">{children}</span>
      {removable && (
        <button
          type="button"
          className="badge__remove"
          onClick={handleRemove}
          aria-label="Remove badge"
        >
          ×
        </button>
      )}
    </span>
  );
}

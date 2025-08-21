import * as React from 'react';
import clsx from 'clsx';
import '@/app/style/ui/card.scss';

type CardVariant = 'default' | 'elevated' | 'outlined';
type CardSize = 'small' | 'medium' | 'large';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Card({
  children,
  variant = 'default',
  size = 'medium',
  className,
  onClick,
  disabled = false,
  padding = 'medium',
  header,
  footer,
  ...props
}: CardProps) {
  const isClickable = onClick && !disabled;

  return (
    <div
      className={clsx(
        'card',
        `card--${variant}`,
        `card--${size}`,
        `card--padding-${padding}`,
        {
          'card--clickable': isClickable,
          'card--disabled': disabled,
        },
        className,
      )}
      onClick={isClickable ? onClick : undefined}
      {...props}
    >
      {header && <div className="card__header">{header}</div>}
      <div className="card__content">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}

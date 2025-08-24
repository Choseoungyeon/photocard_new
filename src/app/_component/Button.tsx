import * as React from 'react';
import clsx from 'clsx';
import LoadingBar from './LodaingBar';
import '@/app/style/ui/button-theme.scss';

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
};

export default function Button(props: Props) {
  const {
    onClick,
    children,
    backgroundColor,
    className,
    icon,
    loading,
    type = 'button',
    disabled,
    variant = 'primary',
    size = 'medium',
    ...resProps
  } = props;
  return (
    <button
      className={clsx(
        'buttonContainer',
        `buttonContainer--${variant}`,
        `buttonContainer--${size}`,
        {
          'buttonContainer--loading': loading,
        },
        className,
      )}
      onClick={onClick}
      type={type}
      style={backgroundColor ? { backgroundColor } : undefined}
      disabled={disabled}
    >
      {loading && (
        <LoadingBar className="button_loading_icon" width="22px" height="22px" color="white" />
      )}
      {icon && <span className="button_icon">{icon}</span>}
      {children}
    </button>
  );
}

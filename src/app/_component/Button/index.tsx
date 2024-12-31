import * as React from 'react';
import clsx from 'clsx';
import LoadingBar from '../LodaingBar';
import '@/app/style/ui/button.scss';

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
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
    ...resProps
  } = props;
  return (
    <button
      className={clsx('buttonContainer', className)}
      onClick={onClick}
      type={type}
      style={{ backgroundColor: backgroundColor }}
      disabled={disabled}
    >
      {loading && (
        <LoadingBar className="button_loading_icon" width="22px" height="22px" color="white" />
      )}
      {icon}
      {children}
    </button>
  );
}

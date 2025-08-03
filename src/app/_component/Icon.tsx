import * as React from 'react';
import clsx from 'clsx';
import '@/app/style/ui/icon.scss';

interface IconProps {
  children: React.ReactNode;
  className: string;
}

export default function Icon(props: IconProps) {
  const { children, className } = props;
  return <i className={clsx('icon', className)}>{children}</i>;
}

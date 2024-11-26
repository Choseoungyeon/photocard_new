import * as React from 'react';
import { ReactNode } from 'react';
import '@/app/style/ui/button.scss';

type Props = {
  children: ReactNode;
  backgroundColor?: string;
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
};

export default function Input(props: Props) {
  const { onClick, children, backgroundColor, type = 'button', ...resProps } = props;
  return (
    <button
      className="buttonContainer"
      onClick={onClick}
      type={type}
      style={{ backgroundColor: backgroundColor }}
    >
      {children}
    </button>
  );
}

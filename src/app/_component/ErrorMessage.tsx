import { ReactNode } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import '@/app/style/ui/error-message.scss';

type Props = {
  children: ReactNode | string;
  className?: string;
};

export default function ErrorMessage({ children, className = '' }: Props) {
  return (
    <div className={`error-message ${className}`} role="alert" aria-live="polite">
      {typeof children === 'string' ? (
        <>
          <MdErrorOutline className="error-icon" aria-hidden="true" />
          <p>{children}</p>
        </>
      ) : (
        children
      )}
    </div>
  );
}

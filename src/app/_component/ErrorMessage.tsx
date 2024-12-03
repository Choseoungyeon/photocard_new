import { ReactNode } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import '@/app/style/ui/error-message.scss';

type Props = {
  children: ReactNode | string;
};

export default function ErrorMessage({ children }: Props) {
  return (
    <div className="error-message">
      {typeof children === 'string' ? (
        <>
          <MdErrorOutline className="error-icon" />
          <p>{children}</p>
        </>
      ) : (
        children
      )}
    </div>
  );
}

'use client';
import Error from './_component/Error';
import './style/ui/global-error.scss';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <Error />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import RQProvider from './RQProvider';
import NavMenu from './_component/NavMenu';
import AuthSession from './AuthSession';
import '@/app/style/main.scss';

export const metadata: Metadata = {
  title: 'login-register',
  description: 'login-register sample page',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthSession>
        <body className="layoutWrap">
          <RQProvider>
            <NavMenu />
            {children}
          </RQProvider>
        </body>
      </AuthSession>
    </html>
  );
}

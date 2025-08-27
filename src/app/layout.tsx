import type { Metadata, Viewport } from 'next';
import RQProvider from './RQProvider';
import NavMenu from './_component/NavMenu';
import AuthSession from './AuthSession';
import RulesProvider from './RulesProvider';
import { ModalProvider } from './_context/ModalContext';
import '@/app/style/main.scss';

export const metadata: Metadata = {
  title: 'PhotoCard',
  description: 'PhotoCard 포토카드 서비스',
  icons: {
    icon: [
      { url: '/logo_simple.svg', type: 'image/svg+xml' },
      { url: '/logo_simple.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/logo_simple.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/logo_simple.svg', sizes: '48x48', type: 'image/svg+xml' },
    ],
    apple: '/logo_simple.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
            <ModalProvider>
              <RulesProvider>
                <NavMenu />
                {children}
              </RulesProvider>
            </ModalProvider>
          </RQProvider>
        </body>
      </AuthSession>
    </html>
  );
}

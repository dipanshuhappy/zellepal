import { auth } from '@/auth';
import ClientProviders from '@/providers';
import { Header } from '@/components/Header';
import '@worldcoin/mini-apps-ui-kit-react/styles.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Zelle Pal',
  description: 'Your AI-powered payment assistant',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden`}>
        <ClientProviders session={session}>
          <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="fixed inset-0 w-screen-" />
            <div className="relative z-10 w-full">
              
              <main className="flex-1 w-full overflow-x-hidden">{children}</main>
              <Toaster position="top-center" richColors />
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}

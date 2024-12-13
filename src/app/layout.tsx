import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Trading Bot Dashboard',
  description: 'Monitor and analyze trading bot performance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <div className="fixed top-4 right-4">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}

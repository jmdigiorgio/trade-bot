import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import '@/styles/globals.css';
import '@/styles/datepicker.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
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
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { StorageModeProvider } from '@/components/StorageModeProvider';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Expense Tracker - Manage Your Daily Expenses',
  description: 'A beautiful and intuitive expense tracking application to help you manage your daily spending, visualize your expenses, and stay on budget.',
  keywords: ['expense tracker', 'budget', 'finance', 'money management', 'spending tracker'],
  authors: [{ name: 'Expense Tracker' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <StorageModeProvider>
            <AuthProvider>{children}</AuthProvider>
          </StorageModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

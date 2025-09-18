import './global.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Blue Cross Blue Shield of Mississippi Member Registration',
    description: 'Your trusted healthcare partner in Mississippi',
    keywords: 'health insurance, healthcare, Mississippi, Blue Cross Blue Shield'
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return(
        <html lang="en">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}
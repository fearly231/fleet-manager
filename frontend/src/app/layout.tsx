import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fleet Management System",
  description: "Fleet management system for vehicles, maintenance, and reservations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 flex h-screen`}>
        {/* sidebar */}
        <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col shadow-xl">
          <h1 className="text-2xl font-bold mb-8 text-blue-400">TAB Project</h1>
          <nav className="flex flex-col gap-4">
            <a href="/" className="hover:text-blue-300 transition-colors">Dashboard</a>
            <a href="/vehicle" className="hover:text-blue-300 transition-colors">Vehicles</a>
            <a href="/workers" className="hover:text-blue-300 transition-colors">Workers</a>
            <a href="/reservations" className="hover:text-blue-300 transition-colors">Reservations</a>
            <a href="/actions" className="hover:text-blue-300 transition-colors">Maintenance</a>
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}

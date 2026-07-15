import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwiftFreight – Logistics Operating System for Lesotho",
  description: "SwiftFreight is a modern cloud-based Logistics Operating System that enables courier companies, logistics companies, sourcing businesses, and customers to operate from one intelligent ecosystem.",
  keywords: ["logistics", "Lesotho", "delivery", "tracking", "courier", "freight", "supply chain", "SaaS"],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "SwiftFreight – Logistics Operating System",
    description: "The intelligent logistics ecosystem for Southern Africa",
    siteName: "SwiftFreight",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
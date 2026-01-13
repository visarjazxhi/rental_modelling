import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rental Property Tax Modeler | Australian What-If Scenario Analysis",
  description: "Calculate how purchasing a rental property affects your personal tax position in Australia. Model rental cashflow, depreciation, and tax benefits with real-time calculations.",
  keywords: ["rental property", "tax calculator", "Australia", "negative gearing", "depreciation", "investment property", "tax planning"],
  authors: [{ name: "Property Tax Tools" }],
  openGraph: {
    title: "Rental Property Tax Modeler",
    description: "Australian rental property tax scenario analysis tool",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

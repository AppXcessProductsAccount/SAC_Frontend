import type { Metadata } from "next";
import { Manrope, Lora } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";


const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SelfAwareness | Find Your Inner Calm",
  description: "Experience serenity through guided meditation, sleep stories, and mindful breathing. A journey to clarity starts with a single breath.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{
          __html: `window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`
        }} />
        <script id="zsiqscript" src="https://salesiq.zohopublic.com/widget?wc=siqe285e07adbf5666a58719e70ddbce7cb" defer />
        {/* HitPay SDK */}
        <script src="https://js.hit-pay.com/sdk.js" defer />
      </head>
      <body
        className={`${manrope.variable} ${lora.variable} font-display bg-background-dark text-slate-200 antialiased`}
      >
          <AuthProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthProvider>
      </body>
    </html>
  );
}


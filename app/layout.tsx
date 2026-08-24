import type { Metadata, Viewport } from "next";
import { Manrope, Lora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import PageBackground from "@/components/PageBackground";


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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#eeebf0",
};

// Classic is the only template. The stale `app-theme` key is cleared once so a
// visitor who last saved "modern" is not left with a dead preference in storage.
const THEME_INIT_SCRIPT = `try{localStorage.removeItem('app-theme');}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="classic" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
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
        className={`${manrope.variable} ${lora.variable} font-display bg-background-light text-[#1b1b2b] antialiased`}
      >
          {/* One continuous plate for the whole site. Pages opt in by leaving their
              <main> and sections transparent; an opaque one simply covers it. */}
          <PageBackground />
          <AuthProvider>
            {children}
          </AuthProvider>
      </body>
    </html>
  );
}

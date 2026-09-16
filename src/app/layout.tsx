import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FitPulse — Your personal fitness pulse",
  description:
    "Personal fitness tracker PWA. Daily diet plans, workout logging, AI meal photo calorie estimation, and progress tracking.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/assets/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/icon-48.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/assets/favicon.ico",
    apple: [{ url: "/assets/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FitPulse",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0F1A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} dark`}>
      <body className="font-sans antialiased no-tap-highlight">
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            className:
              "glass !bg-transparent !text-text-primary !border-border/60",
          }}
        />
      </body>
    </html>
  );
}

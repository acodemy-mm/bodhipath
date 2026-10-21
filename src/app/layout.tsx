import type { Metadata } from "next";
import { Fraunces, Noto_Sans, Noto_Sans_Myanmar } from "next/font/google";
import { AppStoreProvider } from "@/lib/store";
import { AuthGate } from "@/components/auth-gate";
import { AppNav } from "@/components/app-nav";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

const notoMyanmar = Noto_Sans_Myanmar({
  weight: ["400", "500", "700"],
  subsets: ["myanmar"],
  variable: "--font-myanmar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ဗောဓိလမ်း · Bodhi Path",
  description:
    "Gamified Dhamma learning — Vipassana, Abhidhamma, daily practice, and Bodhi Tree growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="my"
      className={`${fraunces.variable} ${notoSans.variable} ${notoMyanmar.variable}`}
    >
      <body className="font-body antialiased">
        <AppStoreProvider>
          <AuthGate>
            <AppNav />
            <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 pb-28 pt-6 md:pb-10 md:pt-8">
              {children}
            </main>
          </AuthGate>
        </AppStoreProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageLoadingOverlay, PageLoadingProvider } from "@/components/PageLoading";
import { PlanSwitcher } from "@/components/PlanSwitcher";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Financials Viewer",
  description: "Income statements for public companies, powered by the Fiscal.ai API.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <PageLoadingProvider>
          <header className="site-header">
            <Link href="/" className="site-title">
              Financials Viewer
            </Link>
            <PlanSwitcher />
          </header>
          <main className="page">
            {children}
            <PageLoadingOverlay />
          </main>
        </PageLoadingProvider>
      </body>
    </html>
  );
}

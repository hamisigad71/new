import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/layout/footer";
import { DevCleanup } from "@/components/dev-cleanup"; // 👈 add this

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CinemaHub - Discover Amazing Movies",
  description:
    "Professional movie discovery platform with sleek design and easy navigation",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="cinemahub-theme"
        >
          <AuthProvider>
            <DevCleanup /> {/* 👈 safely inject client-side logic here */}
            <div className="relative flex min-h-screen flex-col bg-background">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

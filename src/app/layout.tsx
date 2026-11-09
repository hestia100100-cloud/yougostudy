import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { PresenceProvider } from "@/components/presence/PresenceProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "yougostudy",
  description: "A little space to focus together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <PresenceProvider>
            <div className="flex min-h-screen flex-col md:flex-row">
              <Sidebar />
              <main className="min-w-0 flex-1 md:h-screen md:overflow-y-auto">{children}</main>
            </div>
          </PresenceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

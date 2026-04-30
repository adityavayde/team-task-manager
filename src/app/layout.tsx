import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Team Task Manager",
  description: "Manage your team's projects and tasks efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem", flex: 1 }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

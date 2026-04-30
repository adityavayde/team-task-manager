"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <header className="header"><div className="container header-content"><span className="logo">TeamTask</span></div></header>;
  }

  return (
    <header className="header">
      <div className="container header-content">
        <Link href="/" className="logo">
          TeamTask
        </Link>
        
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {session ? (
            <>
              <Link href="/dashboard" style={{ color: "var(--muted)", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "var(--foreground)"} onMouseOut={(e) => e.currentTarget.style.color = "var(--muted)"}>Dashboard</Link>
              <Link href="/projects" style={{ color: "var(--muted)", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "var(--foreground)"} onMouseOut={(e) => e.currentTarget.style.color = "var(--muted)"}>Projects</Link>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginLeft: "2rem", borderLeft: "1px solid var(--border)", paddingLeft: "1rem" }}>
                <span style={{ fontSize: "0.875rem" }}>{session.user?.name} ({session.user?.role})</span>
                <button onClick={() => signOut({ callbackUrl: "/login" })} className="btn btn-secondary" style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem" }}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary">Login</Link>
              <Link href="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

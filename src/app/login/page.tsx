"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "4rem auto" }}>
      <div className="card" style={{ padding: "2rem" }}>
        <h1 style={{ marginBottom: "0.5rem", textAlign: "center", fontSize: "1.75rem" }}>Welcome Back</h1>
        <p style={{ color: "var(--muted)", textAlign: "center", marginBottom: "2rem" }}>Log in to access your team tasks</p>
        
        {error && (
          <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", padding: "0.75rem", borderRadius: "var(--radius)", marginBottom: "1rem", fontSize: "0.875rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.75rem", fontSize: "1rem" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--muted)", fontSize: "0.875rem" }}>
          Don't have an account? <Link href="/register" style={{ color: "var(--primary)" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

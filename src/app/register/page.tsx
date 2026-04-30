"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Something went wrong");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "4rem auto" }}>
      <div className="card" style={{ padding: "2rem" }}>
        <h1 style={{ marginBottom: "0.5rem", textAlign: "center", fontSize: "1.75rem" }}>Create Account</h1>
        <p style={{ color: "var(--muted)", textAlign: "center", marginBottom: "2rem" }}>Join your team today</p>
        
        {error && (
          <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", padding: "0.75rem", borderRadius: "var(--radius)", marginBottom: "1rem", fontSize: "0.875rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>

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
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label className="form-label" htmlFor="role">Role</label>
            <select
              id="role"
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin (Project Creator)</option>
            </select>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem" }}>Only Admins can create new projects.</p>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.75rem", fontSize: "1rem" }} disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        
        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--muted)", fontSize: "0.875rem" }}>
          Already have an account? <Link href="/login" style={{ color: "var(--primary)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

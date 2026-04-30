import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div style={{ textAlign: "center", marginTop: "10vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem", fontWeight: 700 }}>
        Manage Your Team's Tasks with <span className="logo">TeamTask</span>
      </h1>
      <p style={{ fontSize: "1.25rem", color: "var(--muted)", maxWidth: "600px", marginBottom: "3rem", lineHeight: 1.6 }}>
        A premium, modern task management solution. Organize projects, assign tasks to your team, and track progress all in one place.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link href="/register" className="btn btn-primary" style={{ fontSize: "1.125rem", padding: "0.75rem 2rem" }}>
          Get Started
        </Link>
        <Link href="/login" className="btn btn-secondary" style={{ fontSize: "1.125rem", padding: "0.75rem 2rem" }}>
          Log In
        </Link>
      </div>
      
      <div style={{ marginTop: "5rem", display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { title: "Project Management", desc: "Create projects and organize work easily." },
          { title: "Task Assignment", desc: "Assign tasks to team members with due dates." },
          { title: "Role-Based Access", desc: "Admin and Member roles for secure control." }
        ].map((feature, i) => (
          <div key={i} className="card" style={{ width: "300px", textAlign: "left" }}>
            <h3 style={{ marginBottom: "0.5rem", color: "var(--primary)" }}>{feature.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

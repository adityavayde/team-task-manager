import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createProject } from "@/app/actions";
import Link from "next/link";

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/projects");
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/projects" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>
          &larr; Back to Projects
        </Link>
        <h1 style={{ fontSize: "2rem", marginTop: "1rem" }}>Create New Project</h1>
      </div>

      <div className="card">
        <form action={createProject}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Project Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              required
              placeholder="e.g., Website Redesign"
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label className="form-label" htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              className="form-input"
              rows={4}
              placeholder="Brief description of the project goals..."
            />
          </div>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            <Link href="/projects" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

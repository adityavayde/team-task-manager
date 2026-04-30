import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import JoinProjectForm from "@/components/JoinProjectForm";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let projects = [];

  if (session.user.role === "ADMIN") {
    projects = await prisma.project.findMany({
      where: { ownerId: session.user.id },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'desc' },
    });
  } else {
    // Get projects the member has explicitly joined
    projects = await prisma.project.findMany({
      where: {
        members: {
          some: { id: session.user.id }
        }
      },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Projects</h1>
          <p style={{ color: "var(--muted)" }}>
            {session.user.role === "ADMIN" ? "Manage your team projects." : "View projects you have joined."}
          </p>
        </div>
        
        {session.user.role === "ADMIN" ? (
          <Link href="/projects/new" className="btn btn-primary">
            + New Project
          </Link>
        ) : (
          <JoinProjectForm />
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>
          <p style={{ fontSize: "1.125rem" }}>No projects found.</p>
          {session.user.role === "ADMIN" ? (
            <Link href="/projects/new" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              Create your first project
            </Link>
          ) : (
            <p style={{ marginTop: "1rem" }}>Enter a Team Code above to join an existing project.</p>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="card" style={{ cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{project.name}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", flex: 1, marginBottom: "1.5rem" }}>
                  {project.description || "No description provided."}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1rem", fontSize: "0.875rem", color: "var(--muted)" }}>
                  <span>{project._count?.tasks || 0} tasks</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

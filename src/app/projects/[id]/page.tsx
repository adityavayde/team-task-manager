import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import TaskBoard from "./TaskBoard";
import { createTask } from "@/app/actions";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: {
        include: {
          assignee: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!project) {
    return <div>Project not found</div>;
  }

  // Get users who joined this project for the assignee dropdown (only if admin)
  const users = session.user.role === "ADMIN" ? await prisma.user.findMany({ 
    where: { joinedProjects: { some: { id } } },
    select: { id: true, name: true } 
  }) : [];

  const createTaskWithId = createTask.bind(null, id);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/projects" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>
          &larr; Back to Projects
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{project.name}</h1>
            <p style={{ color: "var(--muted)" }}>{project.description}</p>
          </div>
          {session.user.role === "ADMIN" && (
            <div style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", padding: "0.75rem 1rem", borderRadius: "var(--radius)" }}>
              <span style={{ color: "var(--muted)", fontSize: "0.875rem", marginRight: "0.5rem" }}>Team Join Code:</span>
              <span style={{ fontWeight: 700, color: "var(--primary)", letterSpacing: "0.1em" }}>{project.joinCode}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem", alignItems: "start" }}>
        <div style={{ gridColumn: session.user.role === "ADMIN" ? "1 / 2" : "1 / -1" }}>
          <TaskBoard tasks={project.tasks} projectId={id} role={session.user.role} userId={session.user.id} />
        </div>

        {session.user.role === "ADMIN" && (
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Create New Task</h2>
            <form action={createTaskWithId}>
              <div className="form-group">
                <label className="form-label" htmlFor="title">Task Title</label>
                <input id="title" name="title" type="text" className="form-input" required />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea id="description" name="description" className="form-input" rows={3} />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="assigneeId">Assign To</label>
                <select id="assigneeId" name="assigneeId" className="form-input">
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                {users.length === 0 && (
                  <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                    No members have joined yet. Share the Team Join Code!
                  </p>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: "2rem" }}>
                <label className="form-label" htmlFor="dueDate">Due Date</label>
                <input id="dueDate" name="dueDate" type="date" className="form-input" />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                Add Task
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

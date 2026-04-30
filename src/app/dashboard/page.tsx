import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;
  const role = session.user.role;

  // Fetch relevant data
  const userTasks = await prisma.task.findMany({
    where: { assigneeId: userId },
    include: { project: true },
    orderBy: { dueDate: 'asc' },
  });

  const todoTasks = userTasks.filter(t => t.status === "TODO");
  const inProgressTasks = userTasks.filter(t => t.status === "IN_PROGRESS");
  const doneTasks = userTasks.filter(t => t.status === "DONE");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Welcome back, {session.user.name}</h1>
          <p style={{ color: "var(--muted)" }}>Here's an overview of your work.</p>
        </div>
        {role === "ADMIN" && (
          <Link href="/projects/new" className="btn btn-primary">
            + New Project
          </Link>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="card" style={{ borderTop: "4px solid var(--danger)" }}>
          <h3 style={{ color: "var(--muted)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>To Do</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: 700 }}>{todoTasks.length}</p>
        </div>
        <div className="card" style={{ borderTop: "4px solid var(--primary)" }}>
          <h3 style={{ color: "var(--muted)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>In Progress</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: 700 }}>{inProgressTasks.length}</p>
        </div>
        <div className="card" style={{ borderTop: "4px solid var(--success)" }}>
          <h3 style={{ color: "var(--muted)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Done</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: 700 }}>{doneTasks.length}</p>
        </div>
      </div>

      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Your Upcoming Tasks</h2>
      
      {todoTasks.length === 0 && inProgressTasks.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
          <p>You have no pending tasks. Great job!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[...todoTasks, ...inProgressTasks].slice(0, 5).map(task => (
            <div key={task.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "1.125rem", marginBottom: "0.25rem" }}>{task.title}</h3>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.875rem", color: "var(--muted)" }}>
                  <span>Project: <Link href={`/projects/${task.projectId}`} style={{ color: "var(--primary)" }}>{task.project.name}</Link></span>
                  {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
              <span style={{ 
                padding: "0.25rem 0.75rem", 
                borderRadius: "9999px", 
                fontSize: "0.75rem", 
                fontWeight: 600,
                backgroundColor: task.status === 'TODO' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                color: task.status === 'TODO' ? 'var(--danger)' : 'var(--primary)'
              }}>
                {task.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { updateTaskStatus } from "@/app/actions";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  dueDate: Date | null;
  assigneeId: string | null;
  assignee: { name: string | null } | null;
};

export default function TaskBoard({ tasks, projectId, role, userId }: { tasks: Task[], projectId: string, role: string, userId: string }) {
  const columns = ["TODO", "IN_PROGRESS", "DONE"];

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus(taskId, newStatus, projectId);
    } catch (error: any) {
      alert(error.message || "Failed to update task status");
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col);
        
        return (
          <div key={col} style={{ backgroundColor: "rgba(31, 41, 55, 0.5)", borderRadius: "var(--radius)", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {col.replace("_", " ")}
              </h3>
              <span style={{ backgroundColor: "var(--card)", padding: "0.125rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem" }}>
                {colTasks.length}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {colTasks.map((task) => {
                const canEdit = role === "ADMIN" || task.assigneeId === userId;
                
                return (
                  <div key={task.id} className="card" style={{ padding: "1rem", borderLeft: col === 'TODO' ? "3px solid var(--danger)" : col === 'IN_PROGRESS' ? "3px solid var(--primary)" : "3px solid var(--success)" }}>
                    <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{task.title}</h4>
                    {task.description && <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "1rem" }}>{task.description}</p>}
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "var(--muted)" }}>
                      <span>{task.assignee?.name || "Unassigned"}</span>
                      {task.dueDate && <span>{new Date(task.dueDate).toLocaleDateString()}</span>}
                    </div>

                    <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.5rem" }}>
                      <select 
                        className="form-input" 
                        style={{ padding: "0.25rem", fontSize: "0.75rem", opacity: canEdit ? 1 : 0.6, cursor: canEdit ? "pointer" : "not-allowed" }}
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        disabled={!canEdit}
                        title={!canEdit ? "You can only edit tasks assigned to you" : ""}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    </div>
                  </div>
                );
              })}
              
              {colTasks.length === 0 && (
                <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--muted)", fontSize: "0.875rem", border: "1px dashed var(--border)", borderRadius: "var(--radius)" }}>
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

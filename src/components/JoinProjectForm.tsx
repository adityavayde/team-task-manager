"use client";

import { useActionState } from "react";
import { joinProject } from "@/app/actions";

export default function JoinProjectForm() {
  const [state, formAction, isPending] = useActionState(joinProject, null);

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input 
          type="text" 
          name="joinCode" 
          className="form-input" 
          placeholder="Enter Team Code" 
          required
          style={{ width: "200px" }}
        />
        <button type="submit" className="btn btn-secondary" disabled={isPending}>
          {isPending ? "Joining..." : "Join Project"}
        </button>
      </div>
      {state?.error && <p style={{ color: "var(--danger)", fontSize: "0.875rem", margin: 0 }}>{state.error}</p>}
    </form>
  );
}

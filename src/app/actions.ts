"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createProject(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) throw new Error("Project name is required");

  let joinCode = generateJoinCode();
  // Ensure unique join code
  while (await prisma.project.findUnique({ where: { joinCode } })) {
    joinCode = generateJoinCode();
  }

  await prisma.project.create({
    data: {
      name,
      description,
      joinCode,
      ownerId: session.user.id,
    },
  });

  revalidatePath("/projects");
}

export async function joinProject(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MEMBER") {
    return { error: "Unauthorized" };
  }

  const joinCode = formData.get("joinCode") as string;
  if (!joinCode) return { error: "Join code is required" };

  const project = await prisma.project.findUnique({ where: { joinCode } });
  if (!project) {
    return { error: "Invalid join code" };
  }

  const alreadyJoined = await prisma.user.findFirst({
    where: { id: session.user.id, joinedProjects: { some: { id: project.id } } }
  });

  if (alreadyJoined) {
    return { error: "You have already joined this project" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      joinedProjects: {
        connect: { id: project.id }
      }
    }
  });

  revalidatePath("/projects");
  return { success: true };
}

export async function createTask(projectId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const assigneeId = formData.get("assigneeId") as string;
  const dueDateStr = formData.get("dueDate") as string;

  if (!title) throw new Error("Task title is required");

  await prisma.task.create({
    data: {
      title,
      description,
      projectId,
      assigneeId: assigneeId || null,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}

export async function updateTaskStatus(taskId: string, status: string, projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");

  if (session.user.role !== "ADMIN" && task.assigneeId !== session.user.id) {
    throw new Error("You are not authorized to edit this task's status");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}

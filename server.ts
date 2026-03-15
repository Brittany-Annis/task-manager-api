// Task Manager REST API — TypeScript + Express
// Full CRUD API for managing tasks with filtering and stats

import express, { Request, Response, NextFunction } from "express";

const app = express();
app.use(express.json());

// ─── Types ────────────────────────────────────────────────────

type Priority = "low" | "medium" | "high";
type Status = "todo" | "in-progress" | "done";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

type CreateTaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;
type UpdateTaskInput = Partial<CreateTaskInput>;

// ─── In-Memory Store ──────────────────────────────────────────

let tasks: Task[] = [
  {
    id: "1",
    title: "Set up project",
    description: "Initialize repo and install dependencies",
    priority: "high",
    status: "done",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Build REST API",
    description: "Create CRUD endpoints for tasks",
    priority: "high",
    status: "in-progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Write tests",
    description: "Add Playwright or Jest test coverage",
    priority: "medium",
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextId = 4;

// ─── Helpers ──────────────────────────────────────────────────

const generateId = (): string => String(nextId++);
const now = (): string => new Date().toISOString();

const validatePriority = (p: string): p is Priority =>
  ["low", "medium", "high"].includes(p);

const validateStatus = (s: string): s is Status =>
  ["todo", "in-progress", "done"].includes(s);

// ─── Routes ───────────────────────────────────────────────────

// GET /tasks — list all tasks (optional ?status= and ?priority= filters)
app.get("/tasks", (req: Request, res: Response) => {
  let result = [...tasks];

  if (req.query.status) {
    result = result.filter((t) => t.status === req.query.status);
  }
  if (req.query.priority) {
    result = result.filter((t) => t.priority === req.query.priority);
  }

  res.json({ count: result.length, tasks: result });
});

// GET /tasks/:id — get one task
app.get("/tasks/:id", (req: Request, res: Response) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// POST /tasks — create a task
app.post("/tasks", (req: Request, res: Response) => {
  const { title, description, priority, status } = req.body as CreateTaskInput;

  if (!title) return res.status(400).json({ error: "Title is required" });
  if (priority && !validatePriority(priority))
    return res.status(400).json({ error: "Invalid priority" });
  if (status && !validateStatus(status))
    return res.status(400).json({ error: "Invalid status" });

  const task: Task = {
    id: generateId(),
    title,
    description: description || "",
    priority: priority || "medium",
    status: status || "todo",
    createdAt: now(),
    updatedAt: now(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

// PATCH /tasks/:id — update a task
app.patch("/tasks/:id", (req: Request, res: Response) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  const updates = req.body as UpdateTaskInput;
  if (updates.priority && !validatePriority(updates.priority))
    return res.status(400).json({ error: "Invalid priority" });
  if (updates.status && !validateStatus(updates.status))
    return res.status(400).json({ error: "Invalid status" });

  tasks[index] = { ...tasks[index], ...updates, updatedAt: now() };
  res.json(tasks[index]);
});

// DELETE /tasks/:id — delete a task
app.delete("/tasks/:id", (req: Request, res: Response) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  const deleted = tasks.splice(index, 1)[0];
  res.json({ message: "Task deleted", task: deleted });
});

// GET /tasks/stats — summary stats
app.get("/stats", (_req: Request, res: Response) => {
  const stats = {
    total: tasks.length,
    byStatus: {
      todo: tasks.filter((t) => t.status === "todo").length,
      "in-progress": tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    },
    byPriority: {
      high: tasks.filter((t) => t.priority === "high").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      low: tasks.filter((t) => t.priority === "low").length,
    },
  };
  res.json(stats);
});

// ─── Error Handler ────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Task Manager API running at http://localhost:${PORT}`);
  console.log(`   GET    /tasks`);
  console.log(`   GET    /tasks/:id`);
  console.log(`   POST   /tasks`);
  console.log(`   PATCH  /tasks/:id`);
  console.log(`   DELETE /tasks/:id`);
  console.log(`   GET    /stats`);
});

export default app;

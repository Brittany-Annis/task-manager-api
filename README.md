# ✅ Task Manager REST API

A fully typed **REST API** built with **TypeScript + Express** for managing tasks. Supports full CRUD, filtering by status/priority, and a stats endpoint.

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/tasks` | List all tasks (supports `?status=` & `?priority=`) |
| GET | `/tasks/:id` | Get a single task |
| POST | `/tasks` | Create a new task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/stats` | Get task counts by status & priority |

## Setup

```bash
npm install express
npm install -D typescript ts-node @types/express @types/node
ts-node server.ts
```

## Example Requests

```bash
# Get all tasks
curl http://localhost:3000/tasks

# Filter by status
curl http://localhost:3000/tasks?status=in-progress

# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Review PR", "priority": "high", "status": "todo"}'

# Update status
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'

# Get stats
curl http://localhost:3000/stats
```

## Sample Stats Response

```json
{
  "total": 3,
  "byStatus": { "todo": 1, "in-progress": 1, "done": 1 },
  "byPriority": { "high": 2, "medium": 1, "low": 0 }
}
```

## Tech Stack
`TypeScript` · `Express` · `Node.js` · `REST API`

// Demonstration tasks; these are not saved user records.
export const tasks = [
  {
    id: "t1",
    projectId: "1",
    name: "Land preparation",
    status: "completed",
    dueDate: "2026-03-10",
  },
  {
    id: "t2",
    projectId: "1",
    name: "Planting",
    status: "completed",
    dueDate: "2026-03-20",
  },
  {
    id: "t3",
    projectId: "1",
    name: "Fertilizer application",
    status: "completed",
    dueDate: "2026-04-10",
  },
  {
    id: "t4",
    projectId: "1",
    name: "Weeding",
    status: "in_progress",
    dueDate: "2026-04-25",
  },
  {
    id: "t5",
    projectId: "1",
    name: "Pest control",
    status: "todo",
    dueDate: "2026-05-10",
  },
];
export function isOverdue(task) {
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  return task.status !== "completed" && task.dueDate < today;
}

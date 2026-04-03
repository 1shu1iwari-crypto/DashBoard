import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateGoalProgress(goal: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If a goal lacks dates (legacy goal from earlier session), default it.
  const created = goal.createdAt ? new Date(goal.createdAt) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  created.setHours(0, 0, 0, 0);

  const deadline = goal.deadline ? new Date(goal.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  deadline.setHours(0, 0, 0, 0);

  let totalDays = (deadline.getTime() - created.getTime()) / (1000 * 3600 * 24);
  if (totalDays <= 0) totalDays = 1; // Prevent division by zero if dates are same

  const daysPassed = (today.getTime() - created.getTime()) / (1000 * 3600 * 24);
  const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));

  let progress = Math.round((daysPassed / totalDays) * 100);
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;

  return { daysLeft, progress, totalDays, daysPassed };
}

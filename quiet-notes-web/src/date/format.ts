import { format } from "date-fns";

// Formats a date-time in the UK local format
export function formatDate(date: Date): string {
  return format(date, "dd/MM/yyyy HH:mm");
}

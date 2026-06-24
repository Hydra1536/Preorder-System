/**
 * Format date to readable string
 */
export function formatDate(date: Date | null | undefined): string {
  if (!date) return "";

  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format date to input format (yyyy-MM-dd'T'HH:mm)
 */
export function formatDateForInput(date: Date | null | undefined): string {
  if (!date) return "";

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Check if preorder is active (based on current date)
 */
export function isPreorderActive(
  startsAt: Date,
  endsAt?: Date | null,
): boolean {
  const now = new Date();

  if (new Date(startsAt) > now) {
    return false;
  }

  if (endsAt && new Date(endsAt) < now) {
    return false;
  }

  return true;
}

/**
 * Generate cursor for pagination
 */
export function generateCursor(value: any): string {
  return Buffer.from(JSON.stringify(value)).toString("base64");
}

/**
 * Decode cursor for pagination
 */
export function decodeCursor(cursor: string): any {
  try {
    return JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

/**
 * Get status label
 */
export function getStatusLabel(status: boolean): string {
  return status ? "Active" : "Inactive";
}

/**
 * Get status badge class
 */
export function getStatusBadgeClass(status: boolean): string {
  return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
}

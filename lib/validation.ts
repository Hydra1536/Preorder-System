/**
 * Strict Input Sanitization Utilities
 * These functions ensure that inputs are properly validated and sanitized
 * before being used in database queries.
 */

/**
 * Whitelist of allowed sort fields
 * Explicit Field Whitelisting: Only these fields can be used for sorting
 */
const ALLOWED_SORT_FIELDS = [
  "name",
  "createdAt",
  "startsAt",
  "endsAt",
] as const;

/**
 * Whitelist of allowed sort directions
 */
const ALLOWED_SORT_DIRECTIONS = ["asc", "desc"] as const;

/**
 * Whitelist of allowed filter statuses
 */
const ALLOWED_FILTER_STATUSES = ["all", "active", "inactive"] as const;

/**
 * Validate and sanitize sort field
 * Enforced Default Fallbacks: Returns default if invalid
 */
export function validateSortField(
  field: any,
): (typeof ALLOWED_SORT_FIELDS)[number] {
  if (ALLOWED_SORT_FIELDS.includes(field)) {
    return field;
  }
  return "createdAt"; // Default fallback
}

/**
 * Validate and sanitize sort direction
 * Enforced Default Fallbacks: Returns default if invalid
 */
export function validateSortDirection(
  direction: any,
): (typeof ALLOWED_SORT_DIRECTIONS)[number] {
  if (ALLOWED_SORT_DIRECTIONS.includes(direction)) {
    return direction;
  }
  return "desc"; // Default fallback
}

/**
 * Validate and sanitize filter status
 * Strict Input Sanitization: Only allowed values
 */
export function validateFilterStatus(
  status: any,
): (typeof ALLOWED_FILTER_STATUSES)[number] {
  if (ALLOWED_FILTER_STATUSES.includes(status)) {
    return status;
  }
  return "all"; // Default fallback
}

/**
 * Validate and sanitize search query
 * Strict Input Sanitization: Remove special characters for partial text optimization
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== "string") {
    return "";
  }
  // Remove leading/trailing whitespace
  let sanitized = query.trim();

  // Limit length to prevent performance issues (Partial Text Optimization)
  sanitized = sanitized.substring(0, 100);

  // Only allow alphanumeric, spaces, and common punctuation
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-_]/g, "");

  return sanitized;
}

/**
 * Validate page number
 * Enforced Default Fallbacks: Returns default if invalid
 */
export function validatePageNumber(page: any): number {
  const pageNum = parseInt(page, 10);
  if (isNaN(pageNum) || pageNum < 1) {
    return 1;
  }
  return pageNum;
}

/**
 * Validate limit/page size
 * Enforced Default Fallbacks: Returns default if invalid
 * Logical Operator Constraints: Maximum limit to prevent performance issues
 */
export function validateLimit(limit: any): number {
  let limitNum = parseInt(limit, 10);
  if (isNaN(limitNum) || limitNum < 1) {
    return 10; // Default
  }
  if (limitNum > 100) {
    return 100; // Maximum limit
  }
  return limitNum;
}

/**
 * Validate preorder name
 * Strict Input Sanitization: Check type and length
 */
export function validatePreorderName(name: any): string {
  if (!name || typeof name !== "string") {
    throw new Error("Name is required and must be a string");
  }

  const trimmed = name.trim();

  if (trimmed.length < 1 || trimmed.length > 255) {
    throw new Error("Name must be between 1 and 255 characters");
  }

  return trimmed;
}

/**
 * Validate products count
 * Strict Input Sanitization: Check type and range
 */
export function validateProducts(products: any): number {
  const num = parseInt(products, 10);

  if (isNaN(num) || num < 1 || num > 1000000) {
    throw new Error("Products must be a number between 1 and 1,000,000");
  }

  return num;
}

/**
 * Validate preorder when value
 * Strict Input Sanitization: Only allowed value
 */
export function validatePreorderWhen(preorderWhen: any): string {
  const allowed = ["out-of-stock", "regardless-of-stock"];

  if (!allowed.includes(preorderWhen)) {
    throw new Error("Invalid preorder when value");
  }

  return preorderWhen;
}

/**
 * Validate date
 * Strict Input Sanitization: Check if valid date
 */
export function validateDate(date: any): Date {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date");
  }

  return dateObj;
}

/**
 * Validate status boolean
 * Strict Input Sanitization: Ensure it's a boolean
 */
export function validateStatus(status: any): boolean {
  if (typeof status === "boolean") {
    return status;
  }

  if (status === "true" || status === "1") {
    return true;
  }

  if (status === "false" || status === "0") {
    return false;
  }

  throw new Error("Status must be a boolean value");
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  validateSortField,
  validateSortDirection,
  validateFilterStatus,
  validateLimit,
} from "@/lib/validation";

/**
 * GET /api/preorders
 *
 * Query parameters:
 * - filter: 'all' | 'active' | 'inactive' (default: 'all')
 * - sort: 'name' | 'createdAt' | 'startsAt' | 'endsAt' (default: 'createdAt')
 * - direction: 'asc' | 'desc' (default: 'desc')
 * - limit: number (default: 10, max: 100)
 * - cursor: base64 encoded cursor for pagination
 *
 * Returns:
 * - data: Preorder[]
 * - nextCursor: string | null
 * - hasMore: boolean
 * - total: number
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract and validate parameters
    const filter = validateFilterStatus(searchParams.get("filter"));
    const sortField = validateSortField(searchParams.get("sort"));
    const sortDirection = validateSortDirection(searchParams.get("direction"));
    const limit = validateLimit(searchParams.get("limit") || "10");
    const cursor = searchParams.get("cursor");

    // Build where clause
    const where: any = {};

    if (filter === "active") {
      where.status = true;
    } else if (filter === "inactive") {
      where.status = false;
    }

    // Get total count for the filter
    const total = await prisma.preorder.count({ where });

    // Fetch all items for sorting (pagination handled after sorting)
    // We'll fetch more than needed to handle sorting correctly
    const allPreorders = await prisma.preorder.findMany({
      where,
      orderBy: { id: "asc" }, // Get all, will sort in JS
    });

    // Custom sorting with case-insensitive support for string fields
    const sortedPreorders = [...allPreorders].sort((a, b) => {
      let aValue: any = (a as any)[sortField];
      let bValue: any = (b as any)[sortField];

      // Handle case-insensitive sorting for string fields
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Compare values
      let comparison = 0;
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      // Apply sort direction
      if (sortDirection === "desc") {
        comparison = -comparison;
      }

      // Secondary tie-breaker: sort by ID
      if (comparison === 0) {
        comparison = a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      }

      return comparison;
    });

    // Find cursor position if provided
    let startIndex = 0;
    if (cursor) {
      try {
        const decodedCursor = JSON.parse(
          Buffer.from(cursor, "base64").toString("utf-8"),
        );
        startIndex = sortedPreorders.findIndex(
          (p) => p.id === decodedCursor.id,
        );
        if (startIndex === -1) {
          return NextResponse.json(
            { error: "Invalid cursor" },
            { status: 400 },
          );
        }
        startIndex += 1; // Start from next item
      } catch {
        return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
      }
    }

    // Apply pagination
    const paginatedPreorders = sortedPreorders.slice(
      startIndex,
      startIndex + limit,
    );

    let hasMore = false;
    let nextCursor = null;

    if (startIndex + limit < sortedPreorders.length) {
      hasMore = true;
      const lastItem = paginatedPreorders[paginatedPreorders.length - 1];
      nextCursor = Buffer.from(JSON.stringify({ id: lastItem.id })).toString(
        "base64",
      );
    }

    return NextResponse.json({
      data: paginatedPreorders,
      nextCursor,
      hasMore,
      total,
    });
  } catch (error) {
    console.error("Error fetching preorders:", error);
    return NextResponse.json(
      { error: "Failed to fetch preorders" },
      { status: 500 },
    );
  }
}

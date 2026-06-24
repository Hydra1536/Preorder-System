import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/preorders/[id]
 *
 * Fetches a single preorder by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid preorder ID" },
        { status: 400 },
      );
    }

    const preorder = await prisma.preorder.findUnique({
      where: { id },
    });

    if (!preorder) {
      return NextResponse.json(
        { error: "Preorder not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(preorder);
  } catch (error) {
    console.error("Error fetching preorder:", error);
    return NextResponse.json(
      { error: "Failed to fetch preorder" },
      { status: 500 },
    );
  }
}

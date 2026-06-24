import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * PATCH /api/preorders/[id]/status
 *
 * Toggles the status of a preorder
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid preorder ID" },
        { status: 400 },
      );
    }

    if (typeof body.status !== "boolean") {
      return NextResponse.json(
        { error: "Status must be a boolean" },
        { status: 400 },
      );
    }

    // Check if preorder exists
    const preorder = await prisma.preorder.findUnique({
      where: { id },
    });

    if (!preorder) {
      return NextResponse.json(
        { error: "Preorder not found" },
        { status: 404 },
      );
    }

    // Update status
    const updated = await prisma.preorder.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating preorder status:", error);
    return NextResponse.json(
      { error: "Failed to update preorder status" },
      { status: 500 },
    );
  }
}

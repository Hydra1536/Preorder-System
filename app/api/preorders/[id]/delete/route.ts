import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * DELETE /api/preorders/[id]
 *
 * Deletes a preorder
 */
export async function DELETE(
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

    // Delete preorder
    await prisma.preorder.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting preorder:", error);
    return NextResponse.json(
      { error: "Failed to delete preorder" },
      { status: 500 },
    );
  }
}

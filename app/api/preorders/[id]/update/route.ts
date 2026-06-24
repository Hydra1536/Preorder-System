import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  validatePreorderName,
  validateProducts,
  validatePreorderWhen,
  validateDate,
  validateStatus,
} from "@/lib/validation";

/**
 * PUT /api/preorders/[id]/update
 *
 * Updates a preorder
 */
export async function PUT(
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

    // Check if preorder exists
    const existing = await prisma.preorder.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Preorder not found" },
        { status: 404 },
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (body.name !== undefined) {
      const name = validatePreorderName(body.name);
      // Check if name already exists (and it's not the same preorder)
      if (name !== existing.name) {
        const nameExists = await prisma.preorder.findUnique({
          where: { name },
        });
        if (nameExists) {
          return NextResponse.json(
            { error: "A preorder with this name already exists" },
            { status: 400 },
          );
        }
      }
      updateData.name = name;
    }

    if (body.products !== undefined) {
      updateData.products = validateProducts(body.products);
    }

    if (body.preorderWhen !== undefined) {
      updateData.preorderWhen = validatePreorderWhen(body.preorderWhen);
    }

    if (body.startsAt !== undefined) {
      updateData.startsAt = validateDate(body.startsAt);
    }

    if (body.endsAt !== undefined) {
      updateData.endsAt = body.endsAt ? validateDate(body.endsAt) : null;
    }

    if (body.status !== undefined) {
      updateData.status = validateStatus(body.status);
    }

    // Update preorder
    const preorder = await prisma.preorder.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(preorder);
  } catch (error: any) {
    console.error("Error updating preorder:", error);

    if (error.message) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to update preorder" },
      { status: 500 },
    );
  }
}

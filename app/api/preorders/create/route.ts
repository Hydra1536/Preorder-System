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
 * POST /api/preorders
 *
 * Creates a new preorder
 *
 * Request body:
 * {
 *   name: string,
 *   products: number,
 *   preorderWhen: 'out-of-stock' | 'regardless-of-stock',
 *   startsAt: string (ISO date),
 *   endsAt?: string (ISO date),
 *   status: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const name = validatePreorderName(body.name);
    const products = validateProducts(body.products);
    const preorderWhen = validatePreorderWhen(body.preorderWhen);
    const startsAt = validateDate(body.startsAt);
    const endsAt = body.endsAt ? validateDate(body.endsAt) : null;
    const status = validateStatus(body.status);

    // Check if name already exists
    const existing = await prisma.preorder.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A preorder with this name already exists" },
        { status: 400 },
      );
    }

    // Create preorder
    const preorder = await prisma.preorder.create({
      data: {
        name,
        products,
        preorderWhen,
        startsAt,
        endsAt,
        status,
      },
    });

    return NextResponse.json(preorder, { status: 201 });
  } catch (error: any) {
    console.error("Error creating preorder:", error);

    if (error.message) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create preorder" },
      { status: 500 },
    );
  }
}

// app/api/admin/procedure-subcategories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - List all procedure subcategories
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parentSlug = searchParams.get("parentSlug");
    const locale = searchParams.get("locale") || "tr";

    const where: { locale: string; parentSlug?: string } = { locale };
    if (parentSlug) {
      where.parentSlug = parentSlug;
    }

    const subcategories = await prisma.procedureSubcategory.findMany({
      where,
      include: {
        features: { orderBy: { order: "asc" } },
        deviceItems: { orderBy: { order: "asc" } },
        treatmentAreas: { orderBy: { order: "asc" } },
        pricing: { orderBy: { order: "asc" } },
        whyUs: { orderBy: { order: "asc" } },
        faqs: { orderBy: { order: "asc" } },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error("Error fetching procedure subcategories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new procedure subcategory
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      features,
      deviceItems,
      treatmentAreas,
      pricing,
      whyUs,
      faqs,
      ...subcategoryData
    } = body;

    const subcategory = await prisma.procedureSubcategory.create({
      data: {
        ...subcategoryData,
        features: features ? { create: features } : undefined,
        deviceItems: deviceItems ? { create: deviceItems } : undefined,
        treatmentAreas: treatmentAreas ? { create: treatmentAreas } : undefined,
        pricing: pricing ? { create: pricing } : undefined,
        whyUs: whyUs ? { create: whyUs } : undefined,
        faqs: faqs ? { create: faqs } : undefined,
      },
      include: {
        features: true,
        deviceItems: true,
        treatmentAreas: true,
        pricing: true,
        whyUs: true,
        faqs: true,
      },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("Error creating procedure subcategory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

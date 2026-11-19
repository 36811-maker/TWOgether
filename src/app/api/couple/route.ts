import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { coupleSpace, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    const spaceData = await db.select().from(coupleSpace).limit(1);
    const partners = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        currentMood: users.currentMood,
        moodUpdatedAt: users.moodUpdatedAt,
      })
      .from(users);

    return NextResponse.json({
      couple: spaceData[0] || null,
      partners,
    });
  } catch (error) {
    console.error("GET /api/couple error:", error);
    return NextResponse.json({ error: "Erro ao buscar dados do casal." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const existing = await db.select().from(coupleSpace).limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Espaço não encontrado." }, { status: 404 });
    }

    const updated = await db
      .update(coupleSpace)
      .set({
        name: body.name ?? existing[0].name,
        slogan: body.slogan ?? existing[0].slogan,
        anniversaryDate: body.anniversaryDate ?? existing[0].anniversaryDate,
        storySummary: body.storySummary ?? existing[0].storySummary,
        updatedAt: new Date(),
      })
      .where(eq(coupleSpace.id, existing[0].id))
      .returning();

    return NextResponse.json({ success: true, couple: updated[0] });
  } catch (error) {
    console.error("PATCH /api/couple error:", error);
    return NextResponse.json({ error: "Erro ao atualizar dados do casal." }, { status: 500 });
  }
}

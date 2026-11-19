import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { homePlans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized();
    const { id } = await params;
    const body = await req.json();

    const updated = await db
      .update(homePlans)
      .set({
        purchased: body.purchased,
        item: body.item,
        room: body.room,
        priority: body.priority,
        estimatedPrice: body.estimatedPrice,
        notes: body.notes,
        inspirationUrl: body.inspirationUrl,
      })
      .where(eq(homePlans.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/home-plans/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar item." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized();
    const { id } = await params;
    await db.delete(homePlans).where(eq(homePlans.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/home-plans/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar item." }, { status: 500 });
  }
}

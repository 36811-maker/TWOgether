import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { goals } from "@/db/schema";
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
      .update(goals)
      .set({
        title: body.title,
        description: body.description,
        category: body.category,
        targetDate: body.targetDate,
        progress: body.progress !== undefined ? Number(body.progress) : undefined,
        status: body.status,
      })
      .where(eq(goals.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Objetivo não encontrado." }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/goals/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar objetivo." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized();
    const { id } = await params;
    await db.delete(goals).where(eq(goals.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/goals/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar objetivo." }, { status: 500 });
  }
}

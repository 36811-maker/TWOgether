import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { dreams } from "@/db/schema";
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
      .update(dreams)
      .set({
        completed: body.completed,
        completedDate: body.completed ? new Date().toISOString().split("T")[0] : null,
        title: body.title,
        description: body.description,
        priority: body.priority,
        estimatedCost: body.estimatedCost,
      })
      .where(eq(dreams.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Sonho não encontrado." }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/dreams/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar sonho." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized();
    const { id } = await params;
    await db.delete(dreams).where(eq(dreams.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/dreams/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar sonho." }, { status: 500 });
  }
}

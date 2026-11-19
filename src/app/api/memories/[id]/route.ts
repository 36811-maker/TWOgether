import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { memories } from "@/db/schema";
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
      .update(memories)
      .set({
        favorite: body.favorite,
        caption: body.caption,
        title: body.title,
      })
      .where(eq(memories.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Memória não encontrada." }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/memories/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar memória." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized();
    const { id } = await params;
    await db.delete(memories).where(eq(memories.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/memories/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar memória." }, { status: 500 });
  }
}

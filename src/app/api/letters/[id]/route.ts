import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { letters } from "@/db/schema";
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
      .update(letters)
      .set({
        isRead: body.isRead,
      })
      .where(eq(letters.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Carta não encontrada." }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/letters/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar carta." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized();
    const { id } = await params;
    await db.delete(letters).where(eq(letters.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/letters/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar carta." }, { status: 500 });
  }
}

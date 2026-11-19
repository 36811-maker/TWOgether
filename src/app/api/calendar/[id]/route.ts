import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { calendarEvents } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized();
    const { id } = await params;
    await db.delete(calendarEvents).where(eq(calendarEvents.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/calendar/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar evento." }, { status: 500 });
  }
}

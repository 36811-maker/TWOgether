import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { notesBoard } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    const notes = await db.select().from(notesBoard).orderBy(desc(notesBoard.createdAt));
    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json({ error: "Erro ao buscar recados." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const { author, content, color, pinned } = body;

    if (!content || !author) {
      return NextResponse.json({ error: "Autor e conteúdo são obrigatórios." }, { status: 400 });
    }

    const newNote = await db
      .insert(notesBoard)
      .values({
        author,
        content,
        color: color || "rose",
        pinned: Boolean(pinned),
      })
      .returning();

    return NextResponse.json(newNote[0]);
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json({ error: "Erro ao criar recado." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { memories } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    const allMemories = await db.select().from(memories).orderBy(desc(memories.date));
    return NextResponse.json(allMemories);
  } catch (error) {
    console.error("GET /api/memories error:", error);
    return NextResponse.json({ error: "Erro ao buscar memórias." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const { title, date, location, imageUrl, caption, category, favorite, createdBy } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Título e URL da imagem são obrigatórios." }, { status: 400 });
    }

    const newMemory = await db
      .insert(memories)
      .values({
        title,
        date: date || new Date().toISOString().split("T")[0],
        location: location || "",
        imageUrl,
        caption: caption || "",
        category: category || "Especial",
        favorite: Boolean(favorite),
        createdBy: createdBy || "Pedro & Emilly",
      })
      .returning();

    return NextResponse.json(newMemory[0]);
  } catch (error) {
    console.error("POST /api/memories error:", error);
    return NextResponse.json({ error: "Erro ao salvar memória." }, { status: 500 });
  }
}

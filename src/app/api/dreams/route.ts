import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { dreams } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    const allDreams = await db.select().from(dreams).orderBy(desc(dreams.createdAt));
    return NextResponse.json(allDreams);
  } catch (error) {
    console.error("GET /api/dreams error:", error);
    return NextResponse.json({ error: "Erro ao buscar sonhos." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const { title, description, category, priority, estimatedCost, imageUrl, createdBy } = body;

    if (!title) {
      return NextResponse.json({ error: "Título é obrigatório." }, { status: 400 });
    }

    const newDream = await db
      .insert(dreams)
      .values({
        title,
        description: description || "",
        category: category || "Experiências",
        priority: priority || "Alta",
        estimatedCost: estimatedCost || "",
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80",
        completed: false,
        createdBy: createdBy || "Pedro & Emilly",
      })
      .returning();

    return NextResponse.json(newDream[0]);
  } catch (error) {
    console.error("POST /api/dreams error:", error);
    return NextResponse.json({ error: "Erro ao criar sonho." }, { status: 500 });
  }
}

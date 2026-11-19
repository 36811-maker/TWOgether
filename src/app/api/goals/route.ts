import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { goals } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    const allGoals = await db.select().from(goals).orderBy(desc(goals.createdAt));
    return NextResponse.json(allGoals);
  } catch (error) {
    console.error("GET /api/goals error:", error);
    return NextResponse.json({ error: "Erro ao buscar objetivos." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const { title, description, category, targetDate, progress, status, createdBy } = body;

    if (!title) {
      return NextResponse.json({ error: "Título é obrigatório." }, { status: 400 });
    }

    const newGoal = await db
      .insert(goals)
      .values({
        title,
        description: description || "",
        category: category || "Vida a Dois",
        targetDate: targetDate || "",
        progress: progress !== undefined ? Number(progress) : 0,
        status: status || "Em andamento",
        createdBy: createdBy || "Pedro & Emilly",
      })
      .returning();

    return NextResponse.json(newGoal[0]);
  } catch (error) {
    console.error("POST /api/goals error:", error);
    return NextResponse.json({ error: "Erro ao criar objetivo." }, { status: 500 });
  }
}

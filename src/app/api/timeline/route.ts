import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { timeline } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    const items = await db.select().from(timeline).orderBy(asc(timeline.order));
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/timeline error:", error);
    return NextResponse.json({ error: "Erro ao buscar linha do tempo." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const { date, title, description, category, imageUrl, order } = body;

    if (!title || !date || !description) {
      return NextResponse.json({ error: "Título, data e descrição são obrigatórios." }, { status: 400 });
    }

    const newItem = await db
      .insert(timeline)
      .values({
        date,
        title,
        description,
        category: category || "Marco",
        imageUrl: imageUrl || "",
        order: order ? Number(order) : 10,
      })
      .returning();

    return NextResponse.json(newItem[0]);
  } catch (error) {
    console.error("POST /api/timeline error:", error);
    return NextResponse.json({ error: "Erro ao criar marco na linha do tempo." }, { status: 500 });
  }
}

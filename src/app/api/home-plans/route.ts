import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { homePlans } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    const plans = await db.select().from(homePlans).orderBy(desc(homePlans.createdAt));
    return NextResponse.json(plans);
  } catch (error) {
    console.error("GET /api/home-plans error:", error);
    return NextResponse.json({ error: "Erro ao buscar itens da futura casa." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const { room, item, description, priority, estimatedPrice, inspirationUrl, notes, createdBy } = body;

    if (!item) {
      return NextResponse.json({ error: "Nome do item é obrigatório." }, { status: 400 });
    }

    const newItem = await db
      .insert(homePlans)
      .values({
        room: room || "Sala de Estar",
        item,
        description: description || "",
        priority: priority || "Essencial",
        estimatedPrice: estimatedPrice || "",
        inspirationUrl: inspirationUrl || "",
        notes: notes || "",
        purchased: false,
        createdBy: createdBy || "Pedro & Emilly",
      })
      .returning();

    return NextResponse.json(newItem[0]);
  } catch (error) {
    console.error("POST /api/home-plans error:", error);
    return NextResponse.json({ error: "Erro ao adicionar item para a futura casa." }, { status: 500 });
  }
}

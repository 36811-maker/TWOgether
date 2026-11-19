import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { finances } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    const records = await db.select().from(finances).orderBy(desc(finances.createdAt));
    return NextResponse.json(records);
  } catch (error) {
    console.error("GET /api/finances error:", error);
    return NextResponse.json({ error: "Erro ao buscar finanças." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const { title, type, amount, targetAmount, category, payer, date, notes } = body;

    if (!title || !amount) {
      return NextResponse.json({ error: "Título e valor são obrigatórios." }, { status: 400 });
    }

    const newRecord = await db
      .insert(finances)
      .values({
        title,
        type: type || "reserva",
        amount,
        targetAmount: targetAmount || "",
        category: category || "Casa Nova",
        payer: payer || "Ambos",
        date: date || new Date().toISOString().split("T")[0],
        notes: notes || "",
      })
      .returning();

    return NextResponse.json(newRecord[0]);
  } catch (error) {
    console.error("POST /api/finances error:", error);
    return NextResponse.json({ error: "Erro ao registrar finança." }, { status: 500 });
  }
}

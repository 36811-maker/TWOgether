import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { letters } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    const allLetters = await db.select().from(letters).orderBy(desc(letters.createdAt));
    return NextResponse.json(allLetters);
  } catch (error) {
    console.error("GET /api/letters error:", error);
    return NextResponse.json({ error: "Erro ao buscar cartas." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const { title, sender, recipient, content, type, openCondition, unlockDate } = body;

    if (!title || !content || !sender) {
      return NextResponse.json({ error: "Título, remetente e conteúdo são obrigatórios." }, { status: 400 });
    }

    const newLetter = await db
      .insert(letters)
      .values({
        title,
        sender,
        recipient: recipient || (sender === "Pedro" ? "Emilly" : "Pedro"),
        content,
        type: type || "carta_amor",
        openCondition: openCondition || "",
        unlockDate: unlockDate || null,
        isRead: false,
      })
      .returning();

    return NextResponse.json(newLetter[0]);
  } catch (error) {
    console.error("POST /api/letters error:", error);
    return NextResponse.json({ error: "Erro ao enviar carta." }, { status: 500 });
  }
}

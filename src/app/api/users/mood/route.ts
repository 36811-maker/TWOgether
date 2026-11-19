import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const { userId, mood } = body;

    if (!userId || !mood) {
      return NextResponse.json({ error: "userId e mood são obrigatórios." }, { status: 400 });
    }

    const updated = await db
      .update(users)
      .set({
        currentMood: mood,
        moodUpdatedAt: new Date(),
      })
      .where(eq(users.id, Number(userId)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated[0].id,
        name: updated[0].name,
        currentMood: updated[0].currentMood,
      },
    });
  } catch (error) {
    console.error("PATCH /api/users/mood error:", error);
    return NextResponse.json({ error: "Erro ao atualizar humor." }, { status: 500 });
  }
}

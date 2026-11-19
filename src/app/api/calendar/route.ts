import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { calendarEvents } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    const events = await db.select().from(calendarEvents).orderBy(asc(calendarEvents.date));
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/calendar error:", error);
    return NextResponse.json({ error: "Erro ao buscar eventos do calendário." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const { title, description, date, time, category, isMilestone, countdown, location, createdBy } = body;

    if (!title || !date) {
      return NextResponse.json({ error: "Título e data são obrigatórios." }, { status: 400 });
    }

    const newEvent = await db
      .insert(calendarEvents)
      .values({
        title,
        description: description || "",
        date,
        time: time || "",
        category: category || "Encontro",
        isMilestone: Boolean(isMilestone),
        countdown: countdown !== undefined ? Boolean(countdown) : true,
        location: location || "",
        createdBy: createdBy || "Pedro & Emilly",
      })
      .returning();

    return NextResponse.json(newEvent[0]);
  } catch (error) {
    console.error("POST /api/calendar error:", error);
    return NextResponse.json({ error: "Erro ao criar evento." }, { status: 500 });
  }
}

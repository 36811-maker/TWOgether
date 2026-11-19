import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { trips } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized();
    const { id } = await params;
    const body = await req.json();

    const updated = await db
      .update(trips)
      .set({
        destination: body.destination,
        startDate: body.startDate,
        endDate: body.endDate,
        status: body.status,
        budget: body.budget,
        coverImage: body.coverImage,
        itinerary: typeof body.itinerary === "string" ? body.itinerary : body.itinerary ? JSON.stringify(body.itinerary) : undefined,
        packingList: typeof body.packingList === "string" ? body.packingList : body.packingList ? JSON.stringify(body.packingList) : undefined,
        placesToVisit: typeof body.placesToVisit === "string" ? body.placesToVisit : body.placesToVisit ? JSON.stringify(body.placesToVisit) : undefined,
        notes: body.notes,
      })
      .where(eq(trips.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Viagem não encontrada." }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/trips/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar viagem." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized();
    const { id } = await params;
    await db.delete(trips).where(eq(trips.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/trips/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar viagem." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { trips } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    const allTrips = await db.select().from(trips).orderBy(desc(trips.createdAt));
    return NextResponse.json(allTrips);
  } catch (error) {
    console.error("GET /api/trips error:", error);
    return NextResponse.json({ error: "Erro ao buscar viagens." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const { destination, startDate, endDate, status, budget, coverImage, itinerary, packingList, placesToVisit, notes, createdBy } = body;

    if (!destination) {
      return NextResponse.json({ error: "Destino é obrigatório." }, { status: 400 });
    }

    const newTrip = await db
      .insert(trips)
      .values({
        destination,
        startDate: startDate || "",
        endDate: endDate || "",
        status: status || "Planejando",
        budget: budget || "",
        coverImage: coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80",
        itinerary: typeof itinerary === "string" ? itinerary : JSON.stringify(itinerary || []),
        packingList: typeof packingList === "string" ? packingList : JSON.stringify(packingList || []),
        placesToVisit: typeof placesToVisit === "string" ? placesToVisit : JSON.stringify(placesToVisit || []),
        notes: notes || "",
        createdBy: createdBy || "Pedro & Emilly",
      })
      .returning();

    return NextResponse.json(newTrip[0]);
  } catch (error) {
    console.error("POST /api/trips error:", error);
    return NextResponse.json({ error: "Erro ao criar viagem." }, { status: 500 });
  }
}

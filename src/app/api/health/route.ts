import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureDatabaseInitialized } from "@/db/init";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    await ensureDatabaseInitialized();
    return Response.json({ ok: true, app: "TWOgether", slogan: "Our future, together." });
  } catch (error) {
    console.error("Healthcheck error:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}

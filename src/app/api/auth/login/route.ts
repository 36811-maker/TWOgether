import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Login rate limiting tracking
const loginAttempts: Record<string, { count: number; blockedUntil?: number }> = {};

export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const now = Date.now();

    // Check rate limit: 5 failed attempts locks for 2 minutes
    const tracker = loginAttempts[cleanEmail] || { count: 0 };
    if (tracker.blockedUntil && tracker.blockedUntil > now) {
      const remainingSeconds = Math.ceil((tracker.blockedUntil - now) / 1000);
      return NextResponse.json(
        {
          error: `Muitas tentativas incorretas. Conta temporariamente bloqueada por segurança. Tente novamente em ${remainingSeconds} segundos.`,
        },
        { status: 429 }
      );
    }

    // Lookup user
    const foundUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (foundUsers.length === 0) {
      tracker.count += 1;
      if (tracker.count >= 5) {
        tracker.blockedUntil = now + 2 * 60 * 1000;
      }
      loginAttempts[cleanEmail] = tracker;
      return NextResponse.json(
        { error: "Acesso restrito. Este e-mail não possui autorização no espaço privado TWOgether." },
        { status: 401 }
      );
    }

    const user = foundUsers[0];

    // Check password
    if (user.password !== String(password).trim()) {
      tracker.count += 1;
      if (tracker.count >= 5) {
        tracker.blockedUntil = now + 2 * 60 * 1000;
      }
      loginAttempts[cleanEmail] = tracker;
      return NextResponse.json(
        { error: "Senha incorreta. Verifique suas credenciais de acesso." },
        { status: 401 }
      );
    }

    // Reset attempts on successful login
    delete loginAttempts[cleanEmail];

    // Return authenticated user profile (excluding raw password)
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      currentMood: user.currentMood,
    };

    return NextResponse.json({
      success: true,
      message: `Bem-vindo(a) de volta, ${user.name}!`,
      user: sessionUser,
    });
  } catch (err: unknown) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar autenticação." },
      { status: 500 }
    );
  }
}

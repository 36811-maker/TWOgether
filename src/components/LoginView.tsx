"use client";

import React, { useState } from "react";
import { Heart, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, KeyRound } from "lucide-react";
import { User } from "@/types";

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Falha ao realizar login.");
        setLoading(false);
        return;
      }

      localStorage.setItem("twogether_user", JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } catch (err) {
      console.error(err);
      setError("Erro de conexão ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (target: "pedro" | "emilly") => {
    if (target === "pedro") {
      setEmail("pedro@gmail.com");
      setPassword("13052009");
    } else {
      setEmail("emilly@gmail.com");
      setPassword("11042011");
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-pastel-gradient flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative subtle pastel shapes */}
      <div className="absolute top-12 left-12 text-[#f0d0d2]/60 pointer-events-none">
        <Heart size={56} fill="currentColor" />
      </div>
      <div className="absolute bottom-12 right-12 text-[#e4d8eb]/70 pointer-events-none">
        <Heart size={72} fill="currentColor" />
      </div>
      <div className="absolute top-1/4 right-16 text-[#f5ebd2]/80 pointer-events-none">
        <Sparkles size={36} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#e8a5a5] text-white shadow-sm mb-3.5 ring-4 ring-[#faeaea]">
            <Heart size={26} fill="white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-stone-800">
            TWO<span className="text-[#c87d7d] font-normal">gether</span>
          </h1>
          <p className="text-[#a46868] font-medium tracking-wider mt-1 text-xs uppercase">
            Our future, together.
          </p>
          <p className="text-stone-500 text-xs mt-1.5 max-w-xs mx-auto">
            Espaço privado de planejamento de vida a dois de Pedro e Emilly.
          </p>
        </div>

        {/* Login Card */}
        <div className="pastel-glass-card rounded-3xl p-7 sm:p-8 shadow-sm border border-[#ede1da]">
          <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#f0e6e0]">
            <div className="flex items-center space-x-2 text-stone-600 font-medium text-xs">
              <Lock size={15} className="text-[#c87d7d]" />
              <span>Acesso Privado</span>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#faeaea] text-[#a46868] border border-[#ebd0d0]">
              Somente Convidados
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-[#fdf0f0] border border-[#f2cfcf] text-[#a85050] text-xs leading-relaxed flex items-start space-x-2">
              <span className="font-bold text-[#c87d7d]">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                E-mail cadastrado
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pedro@gmail.com ou emilly@gmail.com"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-stone-800 text-xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                  Senha de Acesso
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <KeyRound size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-stone-800 text-xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8] focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                  aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#e29e9e] hover:bg-[#d88f8f] text-white font-medium text-xs shadow-xs transition flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Entrar no Nosso Espaço</span>
                </>
              )}
            </button>
          </form>

          {/* Quick preset buttons for convenience */}
          <div className="mt-6 pt-5 border-t border-[#f0e6e0] text-center">
            <p className="text-[11px] text-stone-500 mb-2.5 font-medium">
              Acesso rápido das duas contas:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("pedro")}
                className="py-2 px-2.5 rounded-xl border border-[#ebd8d0] bg-[#faf2ee] hover:bg-[#f5e9e3] text-stone-700 text-xs font-medium transition flex flex-col items-center justify-center"
              >
                <span className="font-semibold text-stone-800">Pedro</span>
                <span className="text-[10px] text-stone-400 font-mono">pedro@gmail.com</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("emilly")}
                className="py-2 px-2.5 rounded-xl border border-[#ede0ec] bg-[#fbf3fa] hover:bg-[#f5e7f4] text-stone-700 text-xs font-medium transition flex flex-col items-center justify-center"
              >
                <span className="font-semibold text-stone-800">Emilly</span>
                <span className="text-[10px] text-stone-400 font-mono">emilly@gmail.com</span>
              </button>
            </div>
            <p className="text-[11px] text-stone-400 mt-2.5">
              Ambiente privativo. Somente as duas contas configuradas têm acesso.
            </p>
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-stone-400">
          <p>TWOgether 1.0 • Our future, together.</p>
        </div>
      </div>
    </div>
  );
}

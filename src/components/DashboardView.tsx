"use client";

import React, { useState } from "react";
import {
  Heart,
  Calendar,
  Sparkles,
  Target,
  Home,
  Wallet,
  Mail,
  Plus,
  Send,
  Pin,
  Clock,
  Compass,
  Smile,
  Bookmark,
} from "lucide-react";
import {
  User,
  CoupleSpace,
  Goal,
  Dream,
  CalendarEvent,
  HomePlanItem,
  FinanceItem,
  NoteBoardItem,
} from "@/types";

interface DashboardViewProps {
  currentUser: User;
  coupleSpace: CoupleSpace | null;
  partners: User[];
  goals: Goal[];
  dreams: Dream[];
  events: CalendarEvent[];
  homePlans: HomePlanItem[];
  finances: FinanceItem[];
  notes: NoteBoardItem[];
  onAddNote: (content: string, color: string) => Promise<void>;
  onDeleteNote: (id: number) => Promise<void>;
  setActiveTab: (tab: string) => void;
  onOpenMoodModal: () => void;
}

export default function DashboardView({
  currentUser,
  coupleSpace,
  partners,
  goals,
  dreams,
  events,
  homePlans,
  finances,
  notes,
  onAddNote,
  onDeleteNote,
  setActiveTab,
  onOpenMoodModal,
}: DashboardViewProps) {
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteColor, setNewNoteColor] = useState("rose");
  const [submittingNote, setSubmittingNote] = useState(false);

  // Calculate days together from anniversaryDate (default: 2023-05-13)
  const anniversaryStr = coupleSpace?.anniversaryDate || "2023-05-13";
  const startDate = new Date(anniversaryStr);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const daysTogether = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Find next milestone / event
  const upcomingEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const nextEvent = upcomingEvents[0];

  // Financial summary
  const totalSaved = finances
    .filter((f) => f.type === "reserva")
    .reduce((acc, curr) => {
      const numeric = parseFloat(curr.amount.replace(/[^0-9.-]+/g, "")) || 0;
      return acc + numeric;
    }, 0);

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setSubmittingNote(true);
    await onAddNote(newNoteText.trim(), newNoteColor);
    setNewNoteText("");
    setSubmittingNote(false);
  };

  const partner = partners.find((p) => p.email !== currentUser.email);
  const getInitial = (name?: string) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Hero Welcome Card in Gentle Pastel Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-pastel-hero text-stone-800 p-6 sm:p-9 shadow-xs border border-[#ebdcd5]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-[#faeed1]/30 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-xs text-xs font-medium text-stone-700 border border-white/50">
              <Heart size={12} className="text-[#a46868]" fill="currentColor" />
              <span>Espaço Pedro & Emilly</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-stone-800 leading-tight">
              {currentUser.name}, construindo cada passo do nosso futuro.
            </h1>
            <p className="text-stone-700/90 text-xs sm:text-sm font-light italic">
              &quot;{coupleSpace?.slogan || "Our future, together."}&quot;
            </p>
            <p className="text-stone-600 text-xs leading-relaxed pt-1">
              {coupleSpace?.storySummary ||
                "Construindo cada detalhe do nosso futuro, lado a lado, com carinho, cumplicidade e amor infinito."}
            </p>
          </div>

          {/* Days in love counter widget */}
          <div className="bg-white/70 backdrop-blur-xs border border-white/80 rounded-2xl p-5 text-center min-w-[200px] shadow-2xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Juntos há exatamente
            </span>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-stone-800 my-1">
              {daysTogether}
            </div>
            <span className="text-xs text-[#a46868] font-medium">dias de puro carinho ✨</span>
            <div className="mt-1.5 text-[10px] text-stone-400">
              Desde {new Date(anniversaryStr).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>
      </div>

      {/* Partner Connection & Feelings (No photos, pure pastel initials) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current User Card */}
        <div className="pastel-glass-card rounded-2xl p-4 sm:p-5 border border-[#ede1da] shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-[#e8a8a8] text-white flex items-center justify-center font-bold text-base shadow-2xs">
                {getInitial(currentUser.name)}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold text-stone-800">{currentUser.name} (Você)</span>
                <span className="text-[10px] bg-[#faeaea] text-[#a46868] px-2 py-0.2 rounded-full font-medium">Online</span>
              </div>
              <p className="text-xs text-[#a46868] font-medium mt-0.5">
                {currentUser.currentMood || "Apaixonado(a) 🥰"}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenMoodModal}
            className="text-xs text-[#a46868] hover:text-[#8b4f4f] bg-[#faeaea] hover:bg-[#f6dfdf] px-3 py-1.5 rounded-xl font-medium transition flex items-center space-x-1 cursor-pointer"
          >
            <Smile size={13} />
            <span>Mudar humor</span>
          </button>
        </div>

        {/* Partner Card */}
        <div className="pastel-glass-card rounded-2xl p-4 sm:p-5 border border-[#ede1da] shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-[#d5bfbf] text-stone-700 flex items-center justify-center font-bold text-base shadow-2xs">
                {getInitial(partner?.name)}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold text-stone-800">{partner?.name || "Emilly"}</span>
                <span className="text-[10px] bg-[#eaf2e8] text-[#587a55] px-2 py-0.2 rounded-full font-medium">Em sintonia</span>
              </div>
              <p className="text-xs text-[#a46868] font-medium mt-0.5">
                {partner?.currentMood || "Contando os minutos para o próximo plano ✨"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-400">Conectados</span>
            <div className="flex text-[#c87d7d] justify-end mt-0.5">
              <Heart size={14} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics in Soft Pastel Tones */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setActiveTab("goals")}
          className="pastel-glass-card pastel-card-hover rounded-2xl p-4 cursor-pointer border border-[#ebdcd5]"
        >
          <div className="flex items-center justify-between text-[#a46868] mb-2">
            <Target size={17} />
            <span className="text-xs font-semibold bg-[#faeaea] text-[#a46868] px-2 py-0.5 rounded-lg">
              {goals.length}
            </span>
          </div>
          <p className="text-xs text-stone-500 font-medium">Objetivos Ativos</p>
          <p className="text-sm font-bold text-stone-800 mt-0.5">
            {goals.filter((g) => g.status === "Concluído").length} Concluídos
          </p>
        </div>

        <div
          onClick={() => setActiveTab("dreams")}
          className="pastel-glass-card pastel-card-hover rounded-2xl p-4 cursor-pointer border border-[#ebdcd5]"
        >
          <div className="flex items-center justify-between text-[#c07da0] mb-2">
            <Sparkles size={17} />
            <span className="text-xs font-semibold bg-[#fbf0f6] text-[#b36991] px-2 py-0.5 rounded-lg">
              {dreams.length}
            </span>
          </div>
          <p className="text-xs text-stone-500 font-medium">Sonhos a Dois</p>
          <p className="text-sm font-bold text-stone-800 mt-0.5">
            {dreams.filter((d) => d.completed).length} Realizados
          </p>
        </div>

        <div
          onClick={() => setActiveTab("house")}
          className="pastel-glass-card pastel-card-hover rounded-2xl p-4 cursor-pointer border border-[#ebdcd5]"
        >
          <div className="flex items-center justify-between text-[#af8c58] mb-2">
            <Home size={17} />
            <span className="text-xs font-semibold bg-[#fcf5e8] text-[#9b7741] px-2 py-0.5 rounded-lg">
              {homePlans.length}
            </span>
          </div>
          <p className="text-xs text-stone-500 font-medium">Futura Casa</p>
          <p className="text-sm font-bold text-stone-800 mt-0.5">
            {homePlans.filter((h) => h.purchased).length} Itens Adquiridos
          </p>
        </div>

        <div
          onClick={() => setActiveTab("finances")}
          className="pastel-glass-card pastel-card-hover rounded-2xl p-4 cursor-pointer border border-[#ebdcd5]"
        >
          <div className="flex items-center justify-between text-[#618c64] mb-2">
            <Wallet size={17} />
            <span className="text-xs font-semibold bg-[#eaf4e9] text-[#4d7550] px-2 py-0.5 rounded-lg">
              Reserva
            </span>
          </div>
          <p className="text-xs text-stone-500 font-medium">Economia Conjunta</p>
          <p className="text-sm font-bold text-[#456b48] mt-0.5">
            R$ {totalSaved.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Middle Row: Next Milestone & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Next Important Date / Milestone */}
        <div className="lg:col-span-1 pastel-glass-card rounded-2xl p-5 border border-[#ede1da] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5 text-[#a46868] font-semibold text-xs uppercase tracking-wide">
                <Calendar size={14} />
                <span>Próximo Momento</span>
              </div>
              <button
                onClick={() => setActiveTab("calendar")}
                className="text-[11px] text-[#a46868] hover:underline"
              >
                Ver calendário
              </button>
            </div>

            {nextEvent ? (
              <div className="p-4 rounded-xl bg-[#faf2ee] border border-[#ebdcd5]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#a46868] bg-white px-2 py-0.5 rounded-md shadow-2xs">
                    {nextEvent.category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-[#a46868] font-semibold">
                    <Clock size={12} />
                    <span>{new Date(nextEvent.date).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
                <h4 className="text-base font-serif font-bold text-stone-800 mt-2">
                  {nextEvent.title}
                </h4>
                {nextEvent.description && (
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {nextEvent.description}
                  </p>
                )}
                {nextEvent.location && (
                  <p className="text-[11px] text-stone-500 mt-2 flex items-center space-x-1">
                    <Compass size={12} className="text-[#a46868]" />
                    <span>{nextEvent.location}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-stone-400">
                Nenhum evento agendado recentemente.
              </div>
            )}
          </div>

          <div className="pt-3.5 mt-3.5 border-t border-[#f0e6e0] flex items-center justify-between text-xs">
            <span className="text-stone-500">Novo momento especial?</span>
            <button
              onClick={() => setActiveTab("calendar")}
              className="text-xs text-[#a46868] font-medium hover:underline flex items-center space-x-1"
            >
              <Plus size={13} />
              <span>Agendar</span>
            </button>
          </div>
        </div>

        {/* Quick Shortcut Hub */}
        <div className="lg:col-span-2 pastel-glass-card rounded-2xl p-5 border border-[#ede1da] shadow-2xs">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-bold text-stone-800 flex items-center space-x-2">
              <Sparkles size={15} className="text-[#a46868]" />
              <span>Atalhos Rápidos de Vida a Dois</span>
            </h3>
            <span className="text-[11px] text-stone-400">Ambiente integrado</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => setActiveTab("house")}
              className="p-3 rounded-xl border border-[#ede1da] bg-[#fcfaf7] hover:bg-[#faeaea] text-left transition group cursor-pointer"
            >
              <Home size={18} className="text-[#a46868] mb-1.5" />
              <p className="text-xs font-bold text-stone-800">Futura Casa</p>
              <p className="text-[10px] text-stone-500">Móveis e cômodos</p>
            </button>

            <button
              onClick={() => setActiveTab("letters")}
              className="p-3 rounded-xl border border-[#ede1da] bg-[#fcfaf7] hover:bg-[#faeaea] text-left transition group cursor-pointer"
            >
              <Mail size={18} className="text-[#c07da0] mb-1.5" />
              <p className="text-xs font-bold text-stone-800">Cartas de Amor</p>
              <p className="text-[10px] text-stone-500">Cápsulas e recados</p>
            </button>

            <button
              onClick={() => setActiveTab("trips")}
              className="p-3 rounded-xl border border-[#ede1da] bg-[#fcfaf7] hover:bg-[#faeaea] text-left transition group cursor-pointer"
            >
              <Compass size={18} className="text-[#af8c58] mb-1.5" />
              <p className="text-xs font-bold text-stone-800">Próximas Viagens</p>
              <p className="text-[10px] text-stone-500">Roteiros e malas</p>
            </button>

            <button
              onClick={() => setActiveTab("memories")}
              className="p-3 rounded-xl border border-[#ede1da] bg-[#fcfaf7] hover:bg-[#faeaea] text-left transition group cursor-pointer"
            >
              <Bookmark size={18} className="text-[#a46868] mb-1.5" />
              <p className="text-xs font-bold text-stone-800">Memórias</p>
              <p className="text-[10px] text-stone-500">Nossos momentos</p>
            </button>

            <button
              onClick={() => setActiveTab("finances")}
              className="p-3 rounded-xl border border-[#ede1da] bg-[#fcfaf7] hover:bg-[#faeaea] text-left transition group cursor-pointer"
            >
              <Wallet size={18} className="text-[#618c64] mb-1.5" />
              <p className="text-xs font-bold text-stone-800">Caixinha a Dois</p>
              <p className="text-[10px] text-stone-500">Metas de poupança</p>
            </button>

            <button
              onClick={() => setActiveTab("timeline")}
              className="p-3 rounded-xl border border-[#ede1da] bg-[#fcfaf7] hover:bg-[#faeaea] text-left transition group cursor-pointer"
            >
              <Sparkles size={18} className="text-[#8c74a0] mb-1.5" />
              <p className="text-xs font-bold text-stone-800">Nossa Linha</p>
              <p className="text-[10px] text-stone-500">História cronológica</p>
            </button>
          </div>
        </div>
      </div>

      {/* Mural de Recados & Post-its (Pastel Sticky Notes) */}
      <div className="pastel-glass-card rounded-3xl p-6 sm:p-7 border border-[#ede1da] shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5 pb-3.5 border-b border-[#f0e6e0]">
          <div>
            <div className="flex items-center space-x-2 text-[#a46868] font-bold text-base font-serif">
              <Pin size={16} />
              <span>Mural de Recadinhos Diários</span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Deixe um bilhete carinhoso para seu amor ler hoje.
            </p>
          </div>
          <span className="text-xs font-medium text-stone-400">
            {notes.length} {notes.length === 1 ? "recado" : "recados"} no mural
          </span>
        </div>

        {/* Post new note form */}
        <form onSubmit={handlePostNote} className="mb-5">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder={`Escreva algo doce para ${partner?.name || "seu amor"}...`}
              className="flex-1 px-3.5 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8] focus:bg-white"
            />

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 bg-[#fbf7f4] p-1 border border-[#ebdcd5] rounded-xl">
                {[
                  { color: "rose", bg: "bg-[#f5d5d5]" },
                  { color: "amber", bg: "bg-[#faeed1]" },
                  { color: "emerald", bg: "bg-[#dbe7d5]" },
                  { color: "blue", bg: "bg-[#dbe8f2]" },
                  { color: "purple", bg: "bg-[#e5def0]" },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setNewNoteColor(c.color)}
                    className={`w-4 h-4 rounded-full ${c.bg} transition ${
                      newNoteColor === c.color ? "ring-2 ring-stone-600 scale-110" : "opacity-80 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={submittingNote || !newNoteText.trim()}
                className="px-3.5 py-2.5 rounded-xl bg-[#e29e9e] text-white text-xs font-medium hover:bg-[#d88f8f] transition disabled:opacity-50 flex items-center space-x-1 cursor-pointer"
              >
                <Send size={12} />
                <span>Colar</span>
              </button>
            </div>
          </div>
        </form>

        {/* Sticky Notes Grid in Pastel Tones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {notes.map((note) => {
            const colorClasses: Record<string, string> = {
              rose: "bg-[#faecec] border-[#f0cfcf] text-[#7a4848]",
              amber: "bg-[#fdf6e2] border-[#fae7b8] text-[#735422]",
              emerald: "bg-[#eef5ec] border-[#d8e8d4] text-[#3d5c3b]",
              blue: "bg-[#edf5fa] border-[#d4e6f2] text-[#335670]",
              purple: "bg-[#f4effa] border-[#e2d6f2] text-[#553c70]",
            };
            const currentStyle = colorClasses[note.color] || colorClasses.rose;

            return (
              <div
                key={note.id}
                className={`p-4 rounded-2xl border ${currentStyle} shadow-2xs relative group transition hover:-translate-y-0.5`}
              >
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-black/5">
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                    De: {note.author}
                  </span>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 text-[10px] text-stone-400 hover:text-[#a46868] transition"
                  >
                    Excluir
                  </button>
                </div>
                <p className="text-xs font-sans leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="mt-2.5 text-[9px] opacity-60 text-right">
                  TWOgether Note
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

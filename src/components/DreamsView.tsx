"use client";

import React, { useState } from "react";
import { Sparkles, Plus, Check, Trash2, X, DollarSign, Heart, Compass, Star } from "lucide-react";
import { Dream, User } from "@/types";
import confetti from "canvas-confetti";

interface DreamsViewProps {
  dreams: Dream[];
  currentUser: User;
  onAddDream: (dream: Partial<Dream>) => Promise<void>;
  onToggleDream: (id: number, completed: boolean) => Promise<void>;
  onDeleteDream: (id: number) => Promise<void>;
}

export default function DreamsView({
  dreams,
  currentUser,
  onAddDream,
  onToggleDream,
  onDeleteDream,
}: DreamsViewProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Experiências");
  const [priority, setPriority] = useState("Alta");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredDreams = dreams.filter((d) => {
    if (filter === "pending") return !d.completed;
    if (filter === "completed") return d.completed;
    return true;
  });

  const handleToggle = async (dream: Dream) => {
    const nextCompleted = !dream.completed;
    if (nextCompleted) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    await onToggleDream(dream.id, nextCompleted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);

    await onAddDream({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      estimatedCost: estimatedCost.trim() || undefined,
      imageUrl: null,
      createdBy: currentUser.name,
    });

    setTitle("");
    setDescription("");
    setEstimatedCost("");
    setSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-[#b36991] font-bold text-xs uppercase tracking-wider">
            <Sparkles size={15} />
            <span>Nossa Bucket List</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800">
            Lista de Sonhos Compartilhados
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Cada viagem, conquista e momento mágico que sonhamos viver juntos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#e29e9e] hover:bg-[#d88f8f] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Adicionar Sonho</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        {[
          { id: "all", label: "Todos os Sonhos" },
          { id: "pending", label: "A Realizar" },
          { id: "completed", label: "Realizados ✨" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              filter === tab.id
                ? "bg-[#e29e9e] text-white font-semibold"
                : "bg-white border border-[#ebdcd5] text-stone-600 hover:bg-[#faeaea] hover:text-[#a46868]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dreams Grid without photos - Clean Pastel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDreams.map((dream) => (
          <div
            key={dream.id}
            className={`pastel-glass-card rounded-2xl p-5 border transition flex flex-col justify-between group ${
              dream.completed
                ? "border-[#d8e8d4] bg-[#f5faf3]"
                : "border-[#ede1da] hover:border-[#dfcac2]"
            }`}
          >
            <div>
              {/* Top tag & Priority badge */}
              <div className="flex items-center justify-between pb-2 border-b border-[#f0e6e0]">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f7f2ed] text-stone-600">
                    {dream.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      dream.priority === "Especial"
                        ? "bg-[#f2eef8] text-[#71548e]"
                        : dream.priority === "Alta"
                        ? "bg-[#faeaea] text-[#a46868]"
                        : "bg-[#fdf6e2] text-[#80612c]"
                    }`}
                  >
                    {dream.priority}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteDream(dream.id)}
                  className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-[#a46868] transition p-1"
                  title="Excluir sonho"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Title & Description */}
              <div className="pt-3">
                <h3
                  className={`text-base font-serif font-bold ${
                    dream.completed ? "line-through text-stone-400" : "text-stone-800"
                  }`}
                >
                  {dream.title}
                </h3>
                {dream.description && (
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    {dream.description}
                  </p>
                )}
              </div>

              {dream.estimatedCost && (
                <div className="mt-3 inline-flex items-center space-x-1 text-xs font-semibold text-[#456b48] bg-[#eef5ec] px-2.5 py-0.5 rounded-lg">
                  <DollarSign size={12} />
                  <span>{dream.estimatedCost}</span>
                </div>
              )}
            </div>

            {/* Footer action */}
            <div className="pt-4 mt-3 border-t border-[#f0e6e0] flex items-center justify-between text-xs">
              <span className="text-[10px] text-stone-400">
                Por {dream.createdBy}
              </span>

              <button
                onClick={() => handleToggle(dream)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 cursor-pointer ${
                  dream.completed
                    ? "bg-[#f5ede7] text-stone-600 hover:bg-[#ede3dc]"
                    : "bg-[#faeaea] text-[#a46868] hover:bg-[#f6dfdf] border border-[#ebd0d0]"
                }`}
              >
                {dream.completed ? (
                  <>
                    <Check size={13} className="text-[#426a3f]" />
                    <span>Conquistado</span>
                  </>
                ) : (
                  <>
                    <Heart size={13} className="text-[#c87d7d]" />
                    <span>Realizado</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Dream Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-[#ede1da] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0e6e0]">
              <h3 className="text-base font-serif font-bold text-stone-800 flex items-center space-x-2">
                <Sparkles size={17} className="text-[#b36991]" />
                <span>Adicionar à Nossa Bucket List</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Qual é o sonho? *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Ver o sol nascer em um balão na Capadócia"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Por que esse momento é especial para nós?
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Detalhes, sentimentos ou o que queremos sentir..."
                  className="w-full px-3.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  >
                    <option value="Experiências">Experiências</option>
                    <option value="Aventuras">Aventuras</option>
                    <option value="Romântico">Romântico</option>
                    <option value="Bens & Conquistas">Conquistas</option>
                    <option value="Vida a Dois">Vida a Dois</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">
                    Prioridade
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  >
                    <option value="Especial">Especial ✨</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">
                    Custo Estimado
                  </label>
                  <input
                    type="text"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    placeholder="Ex: R$ 5.000"
                    className="w-full px-2.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[#ebdcd5] text-stone-600 text-xs font-medium hover:bg-[#faf7f4]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-xl bg-[#e29e9e] text-white text-xs font-medium hover:bg-[#d88f8f] transition disabled:opacity-50 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Sparkles size={13} />
                  <span>{submitting ? "Adicionando..." : "Salvar Sonho"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

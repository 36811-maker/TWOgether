"use client";

import React, { useState } from "react";
import { Plus, Target, CheckCircle2, Clock, Trash2, X, Sparkles } from "lucide-react";
import { Goal, User } from "@/types";
import confetti from "canvas-confetti";

interface GoalsViewProps {
  goals: Goal[];
  currentUser: User;
  onAddGoal: (goal: Partial<Goal>) => Promise<void>;
  onUpdateGoal: (id: number, updates: Partial<Goal>) => Promise<void>;
  onDeleteGoal: (id: number) => Promise<void>;
}

export default function GoalsView({
  goals,
  currentUser,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}: GoalsViewProps) {
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Moradia");
  const [targetDate, setTargetDate] = useState("");
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Todos",
    "Moradia",
    "Viagem",
    "Financeiro",
    "Vida a Dois",
    "Carreira",
    "Saúde",
  ];

  const filteredGoals =
    filterCategory === "Todos"
      ? goals
      : goals.filter((g) => g.category === filterCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);

    await onAddGoal({
      title: title.trim(),
      description: description.trim(),
      category,
      targetDate,
      progress: Number(progress),
      status: Number(progress) === 100 ? "Concluído" : "Em andamento",
      createdBy: currentUser.name,
    });

    setTitle("");
    setDescription("");
    setProgress(0);
    setTargetDate("");
    setSubmitting(false);
    setIsModalOpen(false);
  };

  const handleUpdateProgress = async (goal: Goal, newProgress: number) => {
    const clamped = Math.min(100, Math.max(0, newProgress));
    const isCompleted = clamped === 100;

    if (isCompleted && goal.progress < 100) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    await onUpdateGoal(goal.id, {
      progress: clamped,
      status: isCompleted ? "Concluído" : "Em andamento",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-[#a46868] font-bold text-xs uppercase tracking-wider">
            <Target size={15} />
            <span>Planejamento de Vida</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800">
            Nossos Objetivos a Dois
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Metas estruturadas para construir um futuro sólido, amoroso e próspero.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#e29e9e] hover:bg-[#d88f8f] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Novo Objetivo</span>
        </button>
      </div>

      {/* Category Pills in Pastel Style */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              filterCategory === cat
                ? "bg-[#e29e9e] text-white font-semibold"
                : "bg-white border border-[#ebdcd5] text-stone-600 hover:bg-[#faeaea] hover:text-[#a46868]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.map((goal) => {
          const isDone = goal.progress === 100 || goal.status === "Concluído";

          return (
            <div
              key={goal.id}
              className={`pastel-glass-card rounded-2xl p-5 border transition ${
                isDone
                  ? "border-[#d8e8d4] bg-[#f5faf3]"
                  : "border-[#ede1da] hover:border-[#dfcac2]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f7f2ed] text-stone-600">
                  {goal.category}
                </span>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isDone
                        ? "bg-[#e2f0de] text-[#426a3f]"
                        : "bg-[#faeaea] text-[#a46868]"
                    }`}
                  >
                    {isDone ? "Concluído" : "Em andamento"}
                  </span>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-stone-300 hover:text-[#a46868] transition p-1"
                    title="Excluir objetivo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <h3
                className={`text-base font-serif font-bold mt-2.5 ${
                  isDone ? "text-stone-500 line-through opacity-80" : "text-stone-800"
                }`}
              >
                {goal.title}
              </h3>

              {goal.description && (
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                  {goal.description}
                </p>
              )}

              {/* Progress bar in pastel tones */}
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs mb-1 font-medium">
                  <span className="text-stone-500">Progresso do casal</span>
                  <span className="text-[#a46868] font-bold">{goal.progress}%</span>
                </div>
                <div className="w-full bg-[#f4ece6] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDone
                        ? "bg-[#91be8c]"
                        : "bg-[#e29e9e]"
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Action buttons & Date */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f0e6e0] text-xs text-stone-400">
                <div className="flex items-center space-x-1 text-[11px]">
                  <Clock size={12} />
                  <span>
                    {goal.targetDate
                      ? `Até ${new Date(goal.targetDate).toLocaleDateString("pt-BR")}`
                      : "Sem prazo fixo"}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  {!isDone && (
                    <button
                      onClick={() =>
                        handleUpdateProgress(goal, goal.progress + 10)
                      }
                      className="px-2 py-1 rounded-lg bg-[#f7f2ed] hover:bg-[#faeaea] hover:text-[#a46868] text-stone-600 text-[11px] font-medium transition cursor-pointer"
                    >
                      +10%
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleUpdateProgress(goal, isDone ? 0 : 100)
                    }
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium transition flex items-center space-x-1 cursor-pointer ${
                      isDone
                        ? "bg-[#f5ede7] text-stone-500 hover:bg-[#ede3dc]"
                        : "bg-[#eaf4e9] text-[#426a3f] hover:bg-[#deede0]"
                    }`}
                  >
                    <CheckCircle2 size={12} />
                    <span>{isDone ? "Reabrir" : "Finalizar"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-[#ede1da] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0e6e0]">
              <h3 className="text-base font-serif font-bold text-stone-800 flex items-center space-x-2">
                <Target size={17} className="text-[#a46868]" />
                <span>Novo Objetivo do Casal</span>
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
                  Título do Objetivo *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Comprar nosso carro elétrico"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Descrição & Detalhes
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Como planejamos realizar isso juntos?"
                  className="w-full px-3.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  >
                    {categories.filter((c) => c !== "Todos").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Data Alvo
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-stone-600 mb-1 font-semibold">
                  <span>Progresso Inicial:</span>
                  <span className="text-[#a46868]">{progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full accent-[#e29e9e] cursor-pointer"
                />
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
                  <span>{submitting ? "Cadastrando..." : "Criar Objetivo"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

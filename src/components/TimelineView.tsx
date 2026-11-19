"use client";

import React, { useState } from "react";
import { GitCommitHorizontal, Plus, Trash2, X, Sparkles, Heart } from "lucide-react";
import { TimelineItem, User } from "@/types";

interface TimelineViewProps {
  items: TimelineItem[];
  currentUser: User;
  onAddItem: (item: Partial<TimelineItem>) => Promise<void>;
  onDeleteItem: (id: number) => Promise<void>;
}

export default function TimelineView({
  items,
  currentUser: _currentUser,
  onAddItem,
  onDeleteItem,
}: TimelineViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Marco");
  const [submitting, setSubmitting] = useState(false);

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !description.trim()) return;
    setSubmitting(true);

    await onAddItem({
      date: date.trim(),
      title: title.trim(),
      description: description.trim(),
      category,
      imageUrl: null,
      order: sortedItems.length + 1,
    });

    setDate("");
    setTitle("");
    setDescription("");
    setSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-[#a46868] font-bold text-xs uppercase tracking-wider">
            <GitCommitHorizontal size={15} />
            <span>Nossa Jornada</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800">
            Linha do Tempo Compartilhada
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Desde o primeiro olhar até os capítulos que ainda estamos escrevendo para o nosso futuro.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#e29e9e] hover:bg-[#d88f8f] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Adicionar Marco</span>
        </button>
      </div>

      {/* Timeline view without photos */}
      <div className="relative pl-6 sm:pl-9 space-y-6 before:absolute before:inset-0 before:left-2 sm:before:left-3 before:w-0.5 before:bg-gradient-to-b before:from-[#e2a8a8] before:via-[#ebdcd5] before:to-[#f2eef8]">
        {sortedItems.map((item, index) => (
          <div key={item.id} className="relative group">
            {/* Timeline node in soft pastel rose */}
            <div className="absolute -left-6 sm:-left-9 mt-1.5 w-4 h-4 rounded-full bg-white border-3 border-[#c87d7d] shadow-2xs flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-[#c87d7d]" />
            </div>

            {/* Card Content */}
            <div className="pastel-glass-card rounded-2xl p-5 border border-[#ede1da] hover:border-[#dfcac2] transition shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#a46868] bg-[#faeaea] px-2.5 py-0.5 rounded-md border border-[#ebd0d0]">
                      {item.date}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-[#f7f2ed] px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-[#a46868] transition p-1"
                    title="Excluir marco"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <h3 className="text-base font-serif font-bold text-stone-800">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                  {item.description}
                </p>

                <div className="pt-1.5 text-[10px] text-stone-400 flex items-center space-x-1">
                  <Heart size={10} className="text-[#a46868]" />
                  <span>Capítulo {index + 1} da nossa história de amor</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Milestone Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-[#ede1da] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0e6e0]">
              <h3 className="text-base font-serif font-bold text-stone-800 flex items-center space-x-2">
                <GitCommitHorizontal size={17} className="text-[#a46868]" />
                <span>Adicionar Marco na Linha do Tempo</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Data ou Época *
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Ex: 15/06/2024 ou Em Breve"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  >
                    <option value="Início">Início</option>
                    <option value="Marco">Marco Importante</option>
                    <option value="Viagem">Viagem Inesquecível</option>
                    <option value="Sonho Realizado">Sonho Realizado</option>
                    <option value="Próximo Capítulo">Próximo Capítulo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Título do Marco *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Mudança para a casa nova"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  História / O que aconteceu? *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Conte o que aconteceu e como marcou nossa história..."
                  required
                  className="w-full px-3.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
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
                  <span>{submitting ? "Adicionando..." : "Salvar Marco"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

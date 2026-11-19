"use client";

import React, { useState } from "react";
import { Bookmark, Plus, Heart, MapPin, Trash2, X, Sparkles, Calendar, BookOpen } from "lucide-react";
import { Memory, User } from "@/types";

interface MemoriesViewProps {
  memories: Memory[];
  currentUser: User;
  onAddMemory: (memory: Partial<Memory>) => Promise<void>;
  onToggleFavorite: (id: number, favorite: boolean) => Promise<void>;
  onDeleteMemory: (id: number) => Promise<void>;
}

export default function MemoriesView({
  memories,
  currentUser,
  onAddMemory,
  onToggleFavorite,
  onDeleteMemory,
}: MemoriesViewProps) {
  const [filterFav, setFilterFav] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Especial");
  const [submitting, setSubmitting] = useState(false);

  const filteredMemories = filterFav
    ? memories.filter((m) => m.favorite)
    : memories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !caption.trim()) return;
    setSubmitting(true);

    await onAddMemory({
      title: title.trim(),
      date: date || new Date().toISOString().split("T")[0],
      location: location.trim() || null,
      imageUrl: "",
      caption: caption.trim() || null,
      category,
      favorite: false,
      createdBy: currentUser.name,
    });

    setTitle("");
    setDate("");
    setLocation("");
    setCaption("");
    setSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-[#a46868] font-bold text-xs uppercase tracking-wider">
            <Bookmark size={15} />
            <span>Diário de Nossas Memórias</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800">
            Caderno de Momentos Especiais
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Cada relato e sensação guardados com carinho para revisitarmos quando bater saudade.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterFav(!filterFav)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition flex items-center space-x-1.5 cursor-pointer ${
              filterFav
                ? "bg-[#faeaea] border-[#ebd0d0] text-[#a46868]"
                : "bg-white border-[#ebdcd5] text-stone-600 hover:bg-[#faf7f4]"
            }`}
          >
            <Heart size={13} className={filterFav ? "text-[#a46868] fill-[#a46868]" : "text-stone-400"} />
            <span>{filterFav ? "Apenas Favoritos" : "Todos os Momentos"}</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#e29e9e] hover:bg-[#d88f8f] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Guardar Momento</span>
          </button>
        </div>
      </div>

      {/* Pastel Journal Memory Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className="pastel-glass-card p-5 rounded-3xl border border-[#ede1da] hover:border-[#dfcac2] transition duration-200 flex flex-col justify-between group shadow-2xs"
          >
            <div>
              {/* Header with Date, Category and Favorite */}
              <div className="flex items-center justify-between pb-2 border-b border-[#f0e6e0]">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f7f2ed] text-stone-600">
                    {mem.category}
                  </span>
                  <span className="text-[11px] text-stone-400 flex items-center space-x-1">
                    <Calendar size={11} />
                    <span>{new Date(mem.date + "T12:00:00").toLocaleDateString("pt-BR")}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onToggleFavorite(mem.id, !mem.favorite)}
                    className="p-1 rounded-full text-[#a46868] hover:bg-[#faeaea] transition cursor-pointer"
                    title={mem.favorite ? "Desfavoritar" : "Favoritar"}
                  >
                    <Heart size={14} fill={mem.favorite ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => onDeleteMemory(mem.id)}
                    className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-[#a46868] transition p-1"
                    title="Excluir momento"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Title & Location */}
              <div className="pt-3">
                <h3 className="text-base font-serif font-bold text-stone-800">
                  {mem.title}
                </h3>

                {mem.location && (
                  <p className="text-[11px] text-[#a46868] flex items-center space-x-1 mt-0.5">
                    <MapPin size={11} />
                    <span>{mem.location}</span>
                  </p>
                )}

                {/* Narrative / Quote */}
                {mem.caption && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-[#faf2ee] border border-[#ebdcd5] text-xs font-serif text-stone-700 italic leading-relaxed">
                    &quot;{mem.caption}&quot;
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 mt-3 border-t border-[#f0e6e0] flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center space-x-1">
                <BookOpen size={11} className="text-[#a46868]" />
                <span>Registrado por {mem.createdBy}</span>
              </span>
              <span className="text-[10px] text-stone-400">Diário TWOgether</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Memory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-[#ede1da] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0e6e0]">
              <h3 className="text-base font-serif font-bold text-stone-800 flex items-center space-x-2">
                <Bookmark size={17} className="text-[#a46868]" />
                <span>Guardar Novo Momento no Diário</span>
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
                  Título do Momento *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Nossa primeira conversa demorada"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Data do Momento
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Local
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Cafeteria da Praça"
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>
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
                  <option value="Especial">Especial</option>
                  <option value="Primeiros Momentos">Primeiros Momentos</option>
                  <option value="Viagens">Viagens</option>
                  <option value="Dia a Dia">Dia a Dia</option>
                  <option value="Datas Especiais">Datas Especiais</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Relato do Momento / O que sentimos nesse dia? *
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  required
                  placeholder="Conte o que tornou essa lembrança tão inesquecível..."
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
                  <span>{submitting ? "Guardando..." : "Salvar no Diário"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

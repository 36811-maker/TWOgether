"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Trash2, X, Sparkles, Heart } from "lucide-react";
import { CalendarEvent, User } from "@/types";

interface CalendarViewProps {
  events: CalendarEvent[];
  currentUser: User;
  onAddEvent: (event: Partial<CalendarEvent>) => Promise<void>;
  onDeleteEvent: (id: number) => Promise<void>;
}

export default function CalendarView({
  events,
  currentUser,
  onAddEvent,
  onDeleteEvent,
}: CalendarViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Encontro");
  const [location, setLocation] = useState("");
  const [isMilestone, setIsMilestone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const calculateDaysLeft = (targetDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setSubmitting(true);

    await onAddEvent({
      title: title.trim(),
      description: description.trim(),
      date,
      time: time || null,
      category,
      location: location.trim() || null,
      isMilestone,
      countdown: true,
      createdBy: currentUser.name,
    });

    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
    setIsMilestone(false);
    setSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-[#a46868] font-bold text-xs uppercase tracking-wider">
            <CalendarIcon size={15} />
            <span>Calendário Compartilhado</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800">
            Datas & Momentos Especiais
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Nossos aniversários, encontros românticos, viagens e contagens regressivas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#e29e9e] hover:bg-[#d88f8f] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Marcar Novo Momento</span>
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3.5">
        {sortedEvents.map((evt) => {
          const daysLeft = calculateDaysLeft(evt.date);
          const isPast = daysLeft < 0;
          const isToday = daysLeft === 0;

          return (
            <div
              key={evt.id}
              className={`pastel-glass-card rounded-2xl p-4 sm:p-5 border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                evt.isMilestone
                  ? "border-[#eec9c9] bg-[#fdf5f5]"
                  : "border-[#ede1da] hover:border-[#dfcac2]"
              }`}
            >
              <div className="flex items-start space-x-3.5">
                {/* Date badge */}
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#ebdcd5] flex flex-col items-center justify-center shadow-2xs shrink-0 text-center">
                  <span className="text-[9px] uppercase font-bold text-[#a46868]">
                    {new Date(evt.date + "T12:00:00").toLocaleString("pt-BR", { month: "short" })}
                  </span>
                  <span className="text-lg font-bold font-serif text-stone-800 leading-tight">
                    {new Date(evt.date + "T12:00:00").getDate()}
                  </span>
                  <span className="text-[9px] text-stone-400">
                    {new Date(evt.date + "T12:00:00").getFullYear()}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f7f2ed] text-stone-600">
                      {evt.category}
                    </span>
                    {evt.isMilestone && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#faeaea] text-[#a46868] border border-[#ebd0d0] flex items-center space-x-1">
                        <Heart size={10} className="fill-[#a46868]" />
                        <span>Marco Inesquecível</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-serif font-bold text-stone-800">
                    {evt.title}
                  </h3>

                  {evt.description && (
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {evt.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-3 text-xs text-stone-400 pt-0.5">
                    {evt.time && (
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{evt.time}</span>
                      </span>
                    )}
                    {evt.location && (
                      <span className="flex items-center space-x-1">
                        <MapPin size={12} className="text-[#a46868]" />
                        <span>{evt.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Countdown badge & Delete */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2.5 sm:pt-0 border-[#f0e6e0] shrink-0 gap-2">
                <div className="text-right">
                  {isToday ? (
                    <span className="text-xs font-bold text-[#a46868] bg-[#faeaea] px-3 py-1 rounded-full border border-[#ebd0d0]">
                      É hoje! ❤️
                    </span>
                  ) : isPast ? (
                    <span className="text-xs text-stone-400 bg-[#f7f2ed] px-2.5 py-1 rounded-full">
                      Aconteceu há {Math.abs(daysLeft)} dias
                    </span>
                  ) : (
                    <div className="bg-[#faeaea] text-[#a46868] px-3 py-1.5 rounded-xl border border-[#ebd0d0] text-center">
                      <span className="text-sm font-bold block leading-none">
                        {daysLeft}
                      </span>
                      <span className="text-[10px] text-[#a46868] font-medium">
                        {daysLeft === 1 ? "dia restante" : "dias restantes"}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onDeleteEvent(evt.id)}
                  className="text-stone-300 hover:text-[#a46868] transition p-1"
                  title="Excluir evento"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-[#ede1da] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0e6e0]">
              <h3 className="text-base font-serif font-bold text-stone-800 flex items-center space-x-2">
                <CalendarIcon size={17} className="text-[#a46868]" />
                <span>Marcar Novo Momento Especial</span>
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
                  placeholder="Ex: Jantar à luz de velas no nosso restaurante"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Descrição & Ideias
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="O que vamos fazer? Algum detalhe que não podemos esquecer?"
                  className="w-full px-3.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Data do Evento *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Horário (Opcional)
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>
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
                    <option value="Encontro">Encontro Romântico</option>
                    <option value="Aniversário">Aniversário</option>
                    <option value="Viagem">Viagem</option>
                    <option value="Compromisso">Compromisso do Casal</option>
                    <option value="Marco Especial">Marco Especial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Local / Endereço
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Em casa ou Bistrô Central"
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="milestone"
                  checked={isMilestone}
                  onChange={(e) => setIsMilestone(e.target.checked)}
                  className="rounded text-[#e29e9e] focus:ring-[#e2a8a8] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="milestone" className="text-xs text-stone-700 font-medium cursor-pointer">
                  Destacar como Marco Especial do nosso relacionamento
                </label>
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
                  <span>{submitting ? "Agendando..." : "Salvar Momento"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

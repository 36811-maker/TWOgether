"use client";

import React, { useState } from "react";
import { Mail, Plus, Lock, Unlock, Heart, Trash2, X, Send } from "lucide-react";
import { Letter, User } from "@/types";

interface LettersViewProps {
  letters: Letter[];
  currentUser: User;
  onAddLetter: (letter: Partial<Letter>) => Promise<void>;
  onMarkRead: (id: number) => Promise<void>;
  onDeleteLetter: (id: number) => Promise<void>;
}

export default function LettersView({
  letters,
  currentUser,
  onAddLetter,
  onMarkRead,
  onDeleteLetter,
}: LettersViewProps) {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [sender, setSender] = useState(currentUser.name);
  const [recipient, setRecipient] = useState(currentUser.name === "Pedro" ? "Emilly" : "Pedro");
  const [content, setContent] = useState("");
  const [type, setType] = useState("carta_amor");
  const [openCondition, setOpenCondition] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLocked = (letter: Letter) => {
    if (letter.type === "capsula_tempo" && letter.unlockDate) {
      const today = new Date().toISOString().split("T")[0];
      return today < letter.unlockDate;
    }
    return false;
  };

  const handleOpenLetter = async (letter: Letter) => {
    if (isLocked(letter)) {
      alert(`Esta cápsula do tempo está lacrada com carinho até ${new Date(letter.unlockDate! + "T12:00:00").toLocaleDateString("pt-BR")}! Segredo guardado ❤️`);
      return;
    }
    setSelectedLetter(letter);
    if (!letter.isRead) {
      await onMarkRead(letter.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);

    await onAddLetter({
      title: title.trim(),
      sender,
      recipient,
      content: content.trim(),
      type,
      openCondition: openCondition.trim() || null,
      unlockDate: type === "capsula_tempo" && unlockDate ? unlockDate : null,
      isRead: false,
    });

    setTitle("");
    setContent("");
    setOpenCondition("");
    setUnlockDate("");
    setSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-[#c07da0] font-bold text-xs uppercase tracking-wider">
            <Mail size={15} />
            <span>Nossas Cartas & Cápsulas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800">
            Cartas Lacradas & Mensagens do Coração
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Cápsulas do tempo para o futuro, cartas de amor sinceras e envelopes &quot;abra quando...&quot;.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#e29e9e] hover:bg-[#d88f8f] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Escrever Nova Carta</span>
        </button>
      </div>

      {/* Letters Grid in Pastel Card Aesthetic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {letters.map((letter) => {
          const locked = isLocked(letter);

          return (
            <div
              key={letter.id}
              onClick={() => handleOpenLetter(letter)}
              className={`p-5 rounded-3xl border transition cursor-pointer relative group flex flex-col justify-between shadow-2xs ${
                locked
                  ? "bg-[#f5ede7] border-[#ebdcd5] hover:border-[#dfcac2]"
                  : "pastel-glass-card border-[#ede1da] hover:border-[#dfcac2]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#f0e6e0]">
                  <div className="flex items-center space-x-1.5">
                    {locked ? (
                      <span className="p-1 rounded-full bg-[#ebdcd5] text-stone-600">
                        <Lock size={13} />
                      </span>
                    ) : (
                      <span className="p-1 rounded-full bg-[#faeaea] text-[#a46868]">
                        <Unlock size={13} />
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#a46868]">
                      {letter.type === "capsula_tempo"
                        ? "Cápsula do Tempo"
                        : letter.type === "abra_quando"
                        ? "Abra Quando..."
                        : "Carta de Amor"}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLetter(letter.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-[#a46868] transition p-1"
                    title="Excluir carta"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <h3 className="text-base font-serif font-bold text-stone-800 leading-snug">
                  {letter.title}
                </h3>

                {letter.openCondition && (
                  <p className="text-xs text-[#a46868] bg-[#faeaea] p-2 rounded-xl border border-[#ebd0d0] mt-2 font-medium">
                    💌 &quot;{letter.openCondition}&quot;
                  </p>
                )}

                {locked ? (
                  <div className="mt-3.5 p-3 rounded-xl bg-[#ede3dc]/70 text-center">
                    <p className="text-xs text-stone-600 font-semibold flex items-center justify-center space-x-1">
                      <Lock size={12} />
                      <span>Lacrado até {new Date(letter.unlockDate! + "T12:00:00").toLocaleDateString("pt-BR")}</span>
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Aguardando a data certa</p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 mt-2.5 line-clamp-3 italic font-serif leading-relaxed">
                    &quot;{letter.content}&quot;
                  </p>
                )}
              </div>

              {/* Bottom sender & recipient info */}
              <div className="pt-3.5 mt-3.5 border-t border-[#f0e6e0] flex items-center justify-between text-[11px] text-stone-400">
                <span>De {letter.sender} para {letter.recipient}</span>
                <span className="text-[#a46868] font-semibold flex items-center space-x-0.5">
                  <Heart size={11} fill="currentColor" />
                  <span>{locked ? "Bloqueado" : "Ler carta"}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Letter Reading Modal in Soft Pastel Cream */}
      {selectedLetter && (
        <div
          onClick={() => setSelectedLetter(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fbf9f6] rounded-3xl max-w-lg w-full p-7 sm:p-8 shadow-xl border border-[#ede1da] relative"
          >
            <button
              onClick={() => setSelectedLetter(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 p-1"
            >
              <X size={18} />
            </button>

            {/* Wax seal circle in soft dusty rose */}
            <div className="flex justify-center mb-3">
              <div className="w-11 h-11 rounded-full bg-[#c87d7d] text-white flex items-center justify-center shadow-xs ring-4 ring-[#faeaea]">
                <Heart size={18} fill="white" />
              </div>
            </div>

            <div className="text-center pb-3.5 border-b border-[#f0e6e0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a46868]">
                De: {selectedLetter.sender} • Para: {selectedLetter.recipient}
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-800 mt-1">
                {selectedLetter.title}
              </h3>
              {selectedLetter.openCondition && (
                <p className="text-xs text-[#a46868] mt-1 italic">
                  &quot;{selectedLetter.openCondition}&quot;
                </p>
              )}
            </div>

            <div className="my-5 max-h-72 overflow-y-auto pr-2">
              <p className="text-sm font-serif text-stone-700 leading-relaxed whitespace-pre-wrap">
                {selectedLetter.content}
              </p>
            </div>

            <div className="pt-3 border-t border-[#f0e6e0] text-center">
              <p className="text-xs font-serif italic text-stone-400">
                TWOgether • Com todo meu amor, para sempre.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New Letter Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-[#ede1da] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0e6e0]">
              <h3 className="text-base font-serif font-bold text-stone-800 flex items-center space-x-2">
                <Mail size={17} className="text-[#a46868]" />
                <span>Escrever Carta Lacrada</span>
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
                  Título da Carta *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Para ler no dia do nosso casamento"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Quem escreve?
                  </label>
                  <select
                    value={sender}
                    onChange={(e) => {
                      setSender(e.target.value);
                      setRecipient(e.target.value === "Pedro" ? "Emilly" : "Pedro");
                    }}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  >
                    <option value="Pedro">Pedro</option>
                    <option value="Emilly">Emilly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Tipo de Carta
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  >
                    <option value="carta_amor">Carta de Amor (Aberta)</option>
                    <option value="capsula_tempo">Cápsula do Tempo (Bloqueada por Data)</option>
                    <option value="abra_quando">Abra Quando...</option>
                  </select>
                </div>
              </div>

              {type === "capsula_tempo" && (
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Data de Abertura da Cápsula *
                  </label>
                  <input
                    type="date"
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>
              )}

              {type === "abra_quando" && (
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Condição para abrir
                  </label>
                  <input
                    type="text"
                    value={openCondition}
                    onChange={(e) => setOpenCondition(e.target.value)}
                    placeholder="Ex: Abra quando tiver saudades de um abraço meu"
                    className="w-full px-3.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Conteúdo da Carta *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="Escreva do fundo do coração..."
                  required
                  className="w-full px-3.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8] font-serif"
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
                  <Send size={13} />
                  <span>{submitting ? "Lacrando..." : "Lacrar Carta"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

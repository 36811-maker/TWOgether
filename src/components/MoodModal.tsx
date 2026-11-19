"use client";

import React, { useState } from "react";
import { X, Heart, Sparkles, Check } from "lucide-react";
import { User } from "@/types";

interface MoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onMoodUpdated: (newMood: string) => void;
}

const PRESET_MOODS = [
  "Apaixonado(a) 🥰",
  "Com saudades de você 💭",
  "Contando os minutos para nos ver ✨",
  "Feliz e radiante 🌟",
  "Cansado(a), precisando de carinho 🥺",
  "Focado(a) nos nossos objetivos 🚀",
  "Sonhando com nossa casinha 🏡",
  "Preparando surpresas pra você 🤫",
  "Louco(a) para viajar juntos ✈️",
  "Te amo mais do que ontem ❤️",
];

export default function MoodModal({
  isOpen,
  onClose,
  currentUser,
  onMoodUpdated,
}: MoodModalProps) {
  const [selectedMood, setSelectedMood] = useState(currentUser.currentMood || PRESET_MOODS[0]);
  const [customMood, setCustomMood] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    const finalMood = customMood.trim() ? customMood.trim() : selectedMood;
    setSaving(true);
    try {
      const res = await fetch("/api/users/mood", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, mood: finalMood }),
      });
      if (res.ok) {
        onMoodUpdated(finalMood);
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-[#ede1da] relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-[#faf7f4] transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center space-x-1.5 text-[#a46868] mb-1">
          <Heart size={16} fill="currentColor" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Humor do Dia</span>
        </div>
        <h3 className="text-lg font-serif font-bold text-stone-800">
          Como você está se sentindo agora, {currentUser.name}?
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-4">
          Seu parceiro poderá ver seu status em tempo real na plataforma.
        </p>

        {/* Preset choices */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 mb-4">
          {PRESET_MOODS.map((mood) => {
            const isSelected = selectedMood === mood && !customMood;
            return (
              <button
                key={mood}
                onClick={() => {
                  setSelectedMood(mood);
                  setCustomMood("");
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                  isSelected
                    ? "bg-[#faeaea] text-[#a46868] border border-[#ebd0d0]"
                    : "bg-[#fcfaf7] text-stone-700 hover:bg-[#faeaea]/50 border border-[#ede1da]"
                }`}
              >
                <span>{mood}</span>
                {isSelected && <Check size={13} className="text-[#a46868]" />}
              </button>
            );
          })}
        </div>

        {/* Custom input */}
        <div className="mb-4">
          <label className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wide mb-1">
            Ou escreva sua mensagem personalizada:
          </label>
          <input
            type="text"
            value={customMood}
            onChange={(e) => setCustomMood(e.target.value)}
            placeholder="Ex: Pensando em você o dia todo 🌸"
            className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-[#ebdcd5] text-stone-600 text-xs font-medium hover:bg-[#faf7f4]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 rounded-xl bg-[#e29e9e] text-white text-xs font-medium hover:bg-[#d88f8f] transition disabled:opacity-50 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Sparkles size={13} />
            <span>{saving ? "Salvando..." : "Atualizar Sentimento"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

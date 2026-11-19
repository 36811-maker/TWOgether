"use client";

import React, { useState } from "react";
import { Home, Plus, CheckCircle2, Circle, Trash2, X, DollarSign, Sparkles } from "lucide-react";
import { HomePlanItem, User } from "@/types";

interface HousePlanningViewProps {
  items: HomePlanItem[];
  currentUser: User;
  onAddItem: (item: Partial<HomePlanItem>) => Promise<void>;
  onTogglePurchased: (id: number, purchased: boolean) => Promise<void>;
  onDeleteItem: (id: number) => Promise<void>;
}

const ROOMS = [
  "Todos",
  "Sala de Estar",
  "Cozinha",
  "Quarto Principal",
  "Varanda/Jardim",
  "Escritório",
  "Banheiro",
];

const ROOM_ICONS: Record<string, string> = {
  "Sala de Estar": "🛋️",
  "Cozinha": "🍳",
  "Quarto Principal": "🛏️",
  "Varanda/Jardim": "🌿",
  "Escritório": "💻",
  "Banheiro": "🛁",
};

export default function HousePlanningView({
  items,
  currentUser,
  onAddItem,
  onTogglePurchased,
  onDeleteItem,
}: HousePlanningViewProps) {
  const [selectedRoom, setSelectedRoom] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemTitle, setItemTitle] = useState("");
  const [room, setRoom] = useState("Sala de Estar");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Essencial");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredItems =
    selectedRoom === "Todos"
      ? items
      : items.filter((i) => i.room === selectedRoom);

  const calculateTotal = (purchasedOnly: boolean) => {
    return items
      .filter((i) => (purchasedOnly ? i.purchased : true))
      .reduce((acc, curr) => {
        const val = parseFloat(String(curr.estimatedPrice || "").replace(/[^0-9.-]+/g, "")) || 0;
        return acc + val;
      }, 0);
  };

  const totalBudget = calculateTotal(false);
  const totalPurchased = calculateTotal(true);
  const purchasedPercentage = totalBudget > 0 ? Math.round((totalPurchased / totalBudget) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) return;
    setSubmitting(true);

    await onAddItem({
      item: itemTitle.trim(),
      room,
      description: description.trim() || null,
      priority,
      estimatedPrice: estimatedPrice.trim() || null,
      inspirationUrl: null,
      notes: notes.trim() || null,
      purchased: false,
      createdBy: currentUser.name,
    });

    setItemTitle("");
    setDescription("");
    setEstimatedPrice("");
    setNotes("");
    setSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-[#af8c58] font-bold text-xs uppercase tracking-wider">
            <Home size={15} />
            <span>Nosso Futuro Lar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800">
            Planejamento da Futura Casa
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Cada cantinho, móvel, eletrodoméstico e detalhe de aconchego para o nosso ninho.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#e29e9e] hover:bg-[#d88f8f] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Adicionar à Casa</span>
        </button>
      </div>

      {/* House Progress / Budget Summary in Pastel Style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="pastel-glass-card rounded-2xl p-4 border border-[#ebdcd5]">
          <p className="text-xs text-stone-500 font-medium">Orçamento Estimado</p>
          <p className="text-lg font-bold font-serif text-stone-800 mt-0.5">
            R$ {totalBudget.toLocaleString("pt-BR")}
          </p>
          <span className="text-[10px] text-stone-400">Total somando todos os cômodos</span>
        </div>

        <div className="pastel-glass-card rounded-2xl p-4 border border-[#ebdcd5]">
          <p className="text-xs text-stone-500 font-medium">Já Adquirido / Comprado</p>
          <p className="text-lg font-bold font-serif text-[#456b48] mt-0.5">
            R$ {totalPurchased.toLocaleString("pt-BR")}
          </p>
          <span className="text-[10px] text-[#456b48] font-medium">
            {items.filter((i) => i.purchased).length} de {items.length} itens prontos
          </span>
        </div>

        <div className="pastel-glass-card rounded-2xl p-4 border border-[#ebdcd5]">
          <p className="text-xs text-stone-500 font-medium">Progresso da Montagem</p>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-lg font-bold font-serif text-[#a46868]">
              {purchasedPercentage}%
            </span>
            <span className="text-xs text-stone-400">concluído</span>
          </div>
          <div className="w-full bg-[#f4ece6] rounded-full h-2 mt-1 overflow-hidden">
            <div
              className="bg-[#e29e9e] h-full rounded-full transition-all"
              style={{ width: `${purchasedPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Room Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {ROOMS.map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRoom(r)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedRoom === r
                ? "bg-[#e29e9e] text-white font-semibold"
                : "bg-white border border-[#ebdcd5] text-stone-600 hover:bg-[#faeaea] hover:text-[#a46868]"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Items List without photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`pastel-glass-card rounded-2xl p-5 border transition flex flex-col justify-between ${
              item.purchased
                ? "border-[#d8e8d4] bg-[#f5faf3]"
                : "border-[#ede1da] hover:border-[#dfcac2]"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm">{ROOM_ICONS[item.room] || "🏡"}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f7f2ed] text-stone-600">
                    {item.room}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.priority === "Essencial"
                        ? "bg-[#faeaea] text-[#a46868]"
                        : "bg-[#fdf6e2] text-[#80612c]"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="text-stone-300 hover:text-[#a46868] transition p-1"
                  title="Excluir item"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="flex items-start space-x-3 mt-3">
                <button
                  onClick={() => onTogglePurchased(item.id, !item.purchased)}
                  className="mt-0.5 text-stone-400 hover:text-[#456b48] transition shrink-0 cursor-pointer"
                  title={item.purchased ? "Marcar como pendente" : "Marcar como já comprado"}
                >
                  {item.purchased ? (
                    <CheckCircle2 size={18} className="text-[#456b48] fill-[#e2f0de]" />
                  ) : (
                    <Circle size={18} />
                  )}
                </button>

                <div className="flex-1">
                  <h3
                    className={`text-base font-serif font-bold ${
                      item.purchased ? "line-through text-stone-400" : "text-stone-800"
                    }`}
                  >
                    {item.item}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {item.notes && (
                    <p className="text-[11px] text-stone-400 mt-1 italic">
                      Obs: {item.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f0e6e0] text-xs">
              <span className="text-[11px] text-stone-400">
                Por {item.createdBy}
              </span>

              {item.estimatedPrice && (
                <div className="flex items-center space-x-0.5 font-bold text-stone-700 bg-[#f7f2ed] px-2.5 py-0.5 rounded-lg text-xs">
                  <DollarSign size={12} className="text-[#a46868]" />
                  <span>{item.estimatedPrice}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Home Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-[#ede1da] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0e6e0]">
              <h3 className="text-base font-serif font-bold text-stone-800 flex items-center space-x-2">
                <Home size={17} className="text-[#af8c58]" />
                <span>Adicionar à Nossa Futura Casa</span>
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
                  Item / Móvel / Eletrodoméstico *
                </label>
                <input
                  type="text"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="Ex: Cafeteira Espresso Italiana"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Cômodo
                  </label>
                  <select
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  >
                    {ROOMS.filter((r) => r !== "Todos").map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Prioridade
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  >
                    <option value="Essencial">Essencial</option>
                    <option value="Desejo">Desejo de Decoração</option>
                    <option value="Futuro">Mais pra frente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Preço Estimado
                </label>
                <input
                  type="text"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                  placeholder="Ex: R$ 850"
                  className="w-full px-3.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Observações ou Medidas
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Ex: Cor fendi ou cinza claro"
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
                  <span>{submitting ? "Adicionando..." : "Salvar Item"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

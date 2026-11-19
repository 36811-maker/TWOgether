"use client";

import React, { useState } from "react";
import { Wallet, Plus, Trash2, X, TrendingUp, PiggyBank, ArrowDownRight, Sparkles } from "lucide-react";
import { FinanceItem, User } from "@/types";

interface FinancesViewProps {
  finances: FinanceItem[];
  currentUser: User;
  onAddFinance: (item: Partial<FinanceItem>) => Promise<void>;
  onDeleteFinance: (id: number) => Promise<void>;
}

export default function FinancesView({
  finances,
  currentUser: _currentUser,
  onAddFinance,
  onDeleteFinance,
}: FinancesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("reserva");
  const [amount, setAmount] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [category, setCategory] = useState("Casa Nova");
  const [payer, setPayer] = useState("Ambos");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const piggyBanks = finances.filter((f) => f.type === "reserva");
  const contributions = finances.filter((f) => f.type !== "reserva");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount.trim()) return;
    setSubmitting(true);

    await onAddFinance({
      title: title.trim(),
      type,
      amount: amount.trim(),
      targetAmount: targetAmount.trim() || null,
      category,
      payer,
      date: new Date().toISOString().split("T")[0],
      notes: notes.trim() || null,
    });

    setTitle("");
    setAmount("");
    setTargetAmount("");
    setNotes("");
    setSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-[#527d55] font-bold text-xs uppercase tracking-wider">
            <Wallet size={15} />
            <span>Finanças a Dois</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800">
            Nossas Caixinhas & Economias
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Transparência, metas financeiras conjuntas e reservas para os nossos maiores sonhos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#719874] hover:bg-[#628765] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Registrar Caixinha</span>
        </button>
      </div>

      {/* Piggy banks / Savings Goals in Pastel Sage */}
      <div>
        <h3 className="text-sm font-bold text-stone-700 flex items-center space-x-1.5 mb-3">
          <PiggyBank size={16} className="text-[#527d55]" />
          <span>Metas de Poupança do Casal</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {piggyBanks.map((piggy) => {
            const currentVal = parseFloat(piggy.amount.replace(/[^0-9.-]+/g, "")) || 0;
            const targetVal = parseFloat((piggy.targetAmount || "0").replace(/[^0-9.-]+/g, "")) || 0;
            const percent = targetVal > 0 ? Math.min(100, Math.round((currentVal / targetVal) * 100)) : 100;

            return (
              <div
                key={piggy.id}
                className="pastel-glass-card rounded-2xl p-5 border border-[#ede1da] hover:border-[#cfdecc] transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#eaf2e8] text-[#426a3f]">
                      {piggy.category}
                    </span>
                    <button
                      onClick={() => onDeleteFinance(piggy.id)}
                      className="text-stone-300 hover:text-[#a46868] transition p-1"
                      title="Excluir caixinha"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <h4 className="text-base font-serif font-bold text-stone-800 mt-2">
                    {piggy.title}
                  </h4>

                  {piggy.notes && (
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {piggy.notes}
                    </p>
                  )}

                  <div className="mt-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-base font-bold text-[#456b48]">
                        {piggy.amount}
                      </span>
                      {piggy.targetAmount && (
                        <span className="text-xs text-stone-400">
                          Meta: {piggy.targetAmount}
                        </span>
                      )}
                    </div>

                    {piggy.targetAmount && (
                      <div className="w-full bg-[#f4ece6] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#719874] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-[#f0e6e0] flex items-center justify-between text-[11px] text-stone-400">
                  <span>Guardado por: {piggy.payer}</span>
                  {piggy.targetAmount && (
                    <span className="font-semibold text-[#456b48]">{percent}% alcançado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contributions / Balance Activity */}
      <div>
        <h3 className="text-sm font-bold text-stone-700 flex items-center space-x-1.5 mb-3">
          <TrendingUp size={16} className="text-[#527d55]" />
          <span>Histórico de Aportes & Despesas Compartilhadas</span>
        </h3>

        <div className="pastel-glass-card rounded-2xl border border-[#ede1da] overflow-hidden">
          {contributions.length === 0 ? (
            <div className="p-6 text-center text-xs text-stone-400">
              Nenhum aporte registrado ainda. Registre no botão acima!
            </div>
          ) : (
            <div className="divide-y divide-[#f0e6e0]">
              {contributions.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-[#faf7f4] transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-[#eaf2e8] text-[#426a3f] flex items-center justify-center shrink-0">
                      <ArrowDownRight size={16} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-stone-800">{item.title}</p>
                      <p className="text-[11px] text-stone-400">
                        {item.category} • Por {item.payer} • {item.date ? new Date(item.date).toLocaleDateString("pt-BR") : "Recente"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs sm:text-sm font-bold text-[#456b48]">
                      {item.amount}
                    </span>
                    <button
                      onClick={() => onDeleteFinance(item.id)}
                      className="text-stone-300 hover:text-[#a46868] transition p-1"
                      title="Excluir registro"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-[#ede1da] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0e6e0]">
              <h3 className="text-base font-serif font-bold text-stone-800 flex items-center space-x-2">
                <Wallet size={17} className="text-[#527d55]" />
                <span>Registrar Nova Caixinha ou Aporte</span>
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
                  Título / Nome da Reserva *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Fundo Reforma da Cozinha"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#719874]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Tipo
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#719874]"
                  >
                    <option value="reserva">Caixinha / Poupança Meta</option>
                    <option value="contribuicao">Aporte Mensal</option>
                    <option value="despesa">Despesa Compartilhada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#719874]"
                  >
                    <option value="Casa Nova">Casa Nova</option>
                    <option value="Viagem dos Sonhos">Viagem dos Sonhos</option>
                    <option value="Casamento">Casamento</option>
                    <option value="Reserva de Emergência">Reserva de Emergência</option>
                    <option value="Jantares & Lazer">Jantares & Lazer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Valor *
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ex: R$ 2.500"
                    required
                    className="w-full px-3.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#719874]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Meta Total
                  </label>
                  <input
                    type="text"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="Ex: R$ 10.000"
                    className="w-full px-3.5 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#719874]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Quem contribuiu?
                </label>
                <select
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#719874]"
                >
                  <option value="Ambos">Ambos (50% / 50%)</option>
                  <option value="Pedro">Pedro</option>
                  <option value="Emilly">Emilly</option>
                </select>
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
                  className="flex-1 py-2 rounded-xl bg-[#719874] text-white text-xs font-medium hover:bg-[#628765] transition disabled:opacity-50 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Sparkles size={13} />
                  <span>{submitting ? "Registrando..." : "Salvar Registro"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

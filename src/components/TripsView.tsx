"use client";

import React, { useState } from "react";
import { Compass, Plus, Trash2, X, CheckSquare, Square, MapPin, Sparkles, ChevronDown, ChevronUp, Plane } from "lucide-react";
import { Trip, User } from "@/types";

interface TripsViewProps {
  trips: Trip[];
  currentUser: User;
  onAddTrip: (trip: Partial<Trip>) => Promise<void>;
  onUpdateTrip: (id: number, updates: Partial<Trip>) => Promise<void>;
  onDeleteTrip: (id: number) => Promise<void>;
}

export default function TripsView({
  trips,
  currentUser,
  onAddTrip,
  onUpdateTrip,
  onDeleteTrip,
}: TripsViewProps) {
  const [selectedTripId, setSelectedTripId] = useState<number | null>(trips[0]?.id || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Planejando");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  const parseJson = (raw: string, fallback: unknown = []) => {
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  const itineraryItems = selectedTrip ? parseJson(selectedTrip.itinerary, []) : [];
  const packingItems = selectedTrip ? parseJson(selectedTrip.packingList, []) : [];
  const placesItems = selectedTrip ? parseJson(selectedTrip.placesToVisit, []) : [];

  const handleTogglePacking = async (index: number) => {
    if (!selectedTrip) return;
    const updated = [...packingItems];
    updated[index].checked = !updated[index].checked;
    await onUpdateTrip(selectedTrip.id, {
      packingList: JSON.stringify(updated),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    setSubmitting(true);

    const defaultItinerary = [
      { day: "Dia 1", activity: "Chegada, check-in e primeiro jantar especial para comemorar" },
      { day: "Dia 2", activity: "Explorar os principais pontos e cafés locais" },
      { day: "Dia 3", activity: "Passeio ao ar livre e pôr do sol juntinhos" },
    ];

    const defaultPacking = [
      { item: "Documentos e reservas", checked: false, owner: "Ambos" },
      { item: "Carregadores portáteis e fones", checked: false, owner: "Pedro" },
      { item: "Nécessaire e autocuidado", checked: false, owner: "Emilly" },
      { item: "Roupas confortáveis", checked: false, owner: "Ambos" },
    ];

    await onAddTrip({
      destination: destination.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      status,
      budget: budget.trim() || null,
      coverImage: null,
      itinerary: JSON.stringify(defaultItinerary),
      packingList: JSON.stringify(defaultPacking),
      placesToVisit: JSON.stringify(["Centro Histórico", "Ponto Panorâmico", "Cafeteria Charmosa"]),
      notes: notes.trim() || null,
      createdBy: currentUser.name,
    });

    setDestination("");
    setStartDate("");
    setEndDate("");
    setBudget("");
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
            <Compass size={15} />
            <span>Viagens & Aventuras</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800">
            Nossos Próximos Destinos
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Roteiros detalhados, malas compartilhadas e lugares inesquecíveis pelo mundo.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#e29e9e] hover:bg-[#d88f8f] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Planejar Nova Viagem</span>
        </button>
      </div>

      {/* Trip Cards Selector without photos - Clean Pastel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trips.map((trip) => {
          const isSelected = selectedTrip?.id === trip.id;

          return (
            <div
              key={trip.id}
              onClick={() => setSelectedTripId(trip.id)}
              className={`pastel-glass-card rounded-2xl p-5 border cursor-pointer transition ${
                isSelected
                  ? "border-[#e2a8a8] ring-2 ring-[#faeaea] shadow-xs"
                  : "border-[#ede1da] hover:border-[#dfcac2]"
              }`}
            >
              <div className="flex items-start justify-between pb-2 border-b border-[#f0e6e0]">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-xl bg-[#faeaea] text-[#a46868]">
                    <Plane size={15} />
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      trip.status === "Confirmada"
                        ? "bg-[#eaf2e8] text-[#426a3f]"
                        : trip.status === "Realizada"
                        ? "bg-[#f5ede7] text-stone-600"
                        : "bg-[#fdf6e2] text-[#80612c]"
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTrip(trip.id);
                  }}
                  className="text-stone-300 hover:text-[#a46868] transition p-1"
                  title="Excluir viagem"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="pt-3">
                <h3 className="text-base font-serif font-bold text-stone-800">
                  {trip.destination}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {trip.startDate && trip.endDate
                    ? `${new Date(trip.startDate).toLocaleDateString("pt-BR")} até ${new Date(trip.endDate).toLocaleDateString("pt-BR")}`
                    : "Datas a definir com carinho"}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#f0e6e0] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#a46868]">
                  {trip.budget ? `Orçamento: ${trip.budget}` : "Orçamento flexível"}
                </span>
                <span className="text-[11px] text-stone-400 flex items-center space-x-1">
                  <span>{isSelected ? "Roteiro aberto" : "Ver roteiro"}</span>
                  {isSelected ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Trip Details Drawer */}
      {selectedTrip && (
        <div className="pastel-glass-card rounded-3xl p-6 sm:p-7 border border-[#ede1da] shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-[#f0e6e0] gap-2">
            <div>
              <span className="text-xs font-bold text-[#a46868] uppercase tracking-wider">
                Roteiro Ativo
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-800">
                {selectedTrip.destination}
              </h3>
            </div>
            {selectedTrip.notes && (
              <p className="text-xs text-stone-500 max-w-md italic bg-[#faf2ee] p-2.5 rounded-xl border border-[#ebdcd5]">
                &quot;{selectedTrip.notes}&quot;
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Itinerary */}
            <div className="lg:col-span-2 space-y-2.5">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center space-x-1.5">
                <Compass size={14} className="text-[#a46868]" />
                <span>Programação Dia a Dia</span>
              </h4>

              <div className="space-y-2">
                {itineraryItems.map((item: { day: string; activity: string }, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#fdfbf9] border border-[#ede1da] flex items-start space-x-2.5"
                  >
                    <span className="text-xs font-bold text-[#a46868] bg-white px-2 py-0.5 rounded-md shadow-2xs border border-[#ebd0d0] shrink-0">
                      {item.day}
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {item.activity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Spots */}
              <div className="pt-2">
                <h5 className="text-[11px] font-bold text-stone-600 uppercase mb-1.5 flex items-center space-x-1">
                  <MapPin size={13} className="text-[#a46868]" />
                  <span>Pontos Turísticos & Paradas Imperdíveis</span>
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {placesItems.map((spot: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg text-xs bg-[#faeaea] border border-[#ebd0d0] text-[#a46868] font-medium"
                    >
                      📍 {spot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Packing List */}
            <div className="pastel-glass-card rounded-2xl p-4 border border-[#ede1da] space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0e6e0]">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide">Mala do Casal</h4>
                <span className="text-[10px] text-stone-400">
                  {packingItems.filter((p: { checked: boolean }) => p.checked).length} de {packingItems.length} prontos
                </span>
              </div>

              <div className="space-y-1.5">
                {packingItems.map((pack: { item: string; checked: boolean; owner: string }, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => handleTogglePacking(idx)}
                    className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#faf7f4] transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      {pack.checked ? (
                        <CheckSquare size={15} className="text-[#a46868] shrink-0" />
                      ) : (
                        <Square size={15} className="text-stone-300 shrink-0" />
                      )}
                      <span
                        className={`text-xs ${
                          pack.checked ? "line-through text-stone-400" : "text-stone-700"
                        }`}
                      >
                        {pack.item}
                      </span>
                    </div>
                    <span className="text-[9px] text-stone-400 bg-[#f7f2ed] px-1.5 py-0.5 rounded">
                      {pack.owner}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-[#ede1da] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0e6e0]">
              <h3 className="text-base font-serif font-bold text-stone-800 flex items-center space-x-2">
                <Compass size={17} className="text-[#af8c58]" />
                <span>Planejar Novo Destino</span>
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
                  Destino da Viagem *
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ex: Serra Gaúcha & Vinhedos"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Data de Ida
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Data de Retorno
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  >
                    <option value="Planejando">Planejando</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Realizada">Realizada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Orçamento
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Ex: R$ 4.500"
                    className="w-full px-3 py-2 bg-[#fdfbf9] border border-[#e8ded7] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#e2a8a8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Anotações / Ideias
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Ex: Pousada com lareira no quarto"
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
                  <span>{submitting ? "Criando..." : "Salvar Viagem"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

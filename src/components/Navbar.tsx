"use client";

import React, { useState } from "react";
import {
  Heart,
  Target,
  Sparkles,
  Calendar,
  Home,
  Wallet,
  Compass,
  Bookmark,
  MailOpen,
  GitCommitHorizontal,
  LogOut,
  Smile,
  Copy,
  Check,
  Menu,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import { User, CoupleSpace } from "@/types";

interface NavbarProps {
  currentUser: User;
  coupleSpace: CoupleSpace | null;
  partners: User[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onOpenMoodModal: () => void;
}

export default function Navbar({
  currentUser,
  coupleSpace,
  partners,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenMoodModal,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Visão Geral", icon: Heart },
    { id: "goals", label: "Objetivos", icon: Target },
    { id: "dreams", label: "Sonhos", icon: Sparkles },
    { id: "calendar", label: "Calendário", icon: Calendar },
    { id: "house", label: "Futura Casa", icon: Home },
    { id: "finances", label: "Finanças", icon: Wallet },
    { id: "trips", label: "Viagens", icon: Compass },
    { id: "memories", label: "Memórias", icon: Bookmark },
    { id: "letters", label: "Cartas", icon: MailOpen },
    { id: "timeline", label: "Nossa Linha", icon: GitCommitHorizontal },
  ];

  const handleCopyCode = () => {
    if (coupleSpace?.inviteCode) {
      navigator.clipboard.writeText(coupleSpace.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const partner = partners.find((p) => p.email !== currentUser.email);

  const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f6]/90 backdrop-blur-md border-b border-[#ede1da]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="w-9 h-9 rounded-2xl bg-[#e29e9e] flex items-center justify-center text-white shadow-xs">
              <Heart size={18} fill="white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-xl sm:text-2xl text-stone-800">
                  TWO<span className="text-[#c87d7d] font-normal">gether</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium bg-[#faeaea] text-[#a46868] px-2 py-0.5 rounded-full border border-[#ebd0d0]">
                  {coupleSpace?.name || "Pedro & Emilly"}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#a46868] font-medium tracking-wide">
                Our future, together.
              </p>
            </div>
          </div>

          {/* Couple partner statuses & Ambient sound */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Ambient sound button */}
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              title={isPlayingMusic ? "Silenciar música suave" : "Tocar som suave ambiente"}
              className={`p-2 rounded-xl text-xs flex items-center space-x-1.5 transition ${
                isPlayingMusic
                  ? "bg-[#faeaea] text-[#a46868] font-medium"
                  : "bg-[#f5ede7] text-stone-500 hover:bg-[#ede3dc]"
              }`}
            >
              {isPlayingMusic ? <Volume2 size={15} className="text-[#c87d7d] animate-pulse" /> : <VolumeX size={15} />}
              <span className="hidden lg:inline">{isPlayingMusic ? "Som suave" : "Ambiente"}</span>
            </button>

            {/* Invite code badge */}
            <button
              onClick={handleCopyCode}
              title="Código de vínculo das duas contas"
              className="text-xs bg-[#fbf5f1] hover:bg-[#f5ede7] border border-[#ebdcd5] px-2.5 py-1.5 rounded-xl flex items-center space-x-1.5 text-stone-600 transition"
            >
              <span className="text-[10px] text-stone-400 font-mono">Código:</span>
              <span className="font-mono font-semibold text-[#a46868]">{coupleSpace?.inviteCode || "TWOGETHER-2025"}</span>
              {copiedCode ? <Check size={13} className="text-emerald-500" /> : <Copy size={12} className="text-stone-400" />}
            </button>

            {/* Current user & Partner quick mood without photos */}
            <div className="flex items-center space-x-2 pl-2 border-l border-[#ede1da]">
              <button
                onClick={onOpenMoodModal}
                title="Clique para atualizar como você está se sentindo hoje"
                className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-[#faeaea] hover:bg-[#f6dfdf] text-stone-700 border border-[#ebd0d0] transition group cursor-pointer"
              >
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-[#e8a8a8] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {getInitial(currentUser.name)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-stone-800 leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-[#a46868] truncate max-w-[110px]">
                    {currentUser.currentMood || "Apaixonado(a)"}
                  </p>
                </div>
                <Smile size={13} className="text-[#c87d7d] ml-1" />
              </button>

              {partner && (
                <div
                  title={`Status de ${partner.name}`}
                  className="hidden xl:flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-[#f5efe8] border border-[#e8ded7] text-stone-700"
                >
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-[#d2bebe] text-stone-700 flex items-center justify-center font-bold text-xs">
                      {getInitial(partner.name)}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-stone-800 leading-tight">
                      {partner.name}
                    </p>
                    <p className="text-[10px] text-stone-500 truncate max-w-[110px]">
                      {partner.currentMood || "Online"}
                    </p>
                  </div>
                </div>
              )}

              {/* Logout button */}
              <button
                onClick={onLogout}
                title="Sair da conta"
                className="p-2 text-stone-400 hover:text-[#a46868] hover:bg-[#faeaea] rounded-xl transition cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenMoodModal}
              className="p-1.5 rounded-lg bg-[#faeaea] text-[#a46868]"
            >
              <Smile size={18} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:bg-[#f5ede7]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-[#f0e6e0]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-[#e29e9e] text-white shadow-2xs font-semibold"
                    : "text-stone-600 hover:bg-[#faeaea] hover:text-[#a46868]"
                }`}
              >
                <Icon size={13} className={isActive ? "text-white" : "text-[#c87d7d]"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile dropdown navigation menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#ede1da] bg-[#fbf9f6] px-4 pt-3 pb-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0e6e0]">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#e8a8a8] text-white flex items-center justify-center font-bold text-xs">
                {getInitial(currentUser.name)}
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800">{currentUser.name}</p>
                <p className="text-[10px] text-[#a46868]">{currentUser.currentMood || "Apaixonado(a)"}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-xs text-[#a46868] font-medium px-2.5 py-1 rounded-lg bg-[#faeaea]"
            >
              Sair
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-medium text-left transition ${
                    isActive
                      ? "bg-[#e29e9e] text-white"
                      : "bg-[#f7f1ec] text-stone-700 hover:bg-[#faeaea] hover:text-[#a46868]"
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

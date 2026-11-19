"use client";

import React, { useState, useEffect, useCallback } from "react";
import LoginView from "@/components/LoginView";
import Navbar from "@/components/Navbar";
import DashboardView from "@/components/DashboardView";
import GoalsView from "@/components/GoalsView";
import DreamsView from "@/components/DreamsView";
import CalendarView from "@/components/CalendarView";
import HousePlanningView from "@/components/HousePlanningView";
import FinancesView from "@/components/FinancesView";
import TripsView from "@/components/TripsView";
import MemoriesView from "@/components/MemoriesView";
import LettersView from "@/components/LettersView";
import TimelineView from "@/components/TimelineView";
import MoodModal from "@/components/MoodModal";

import {
  User,
  CoupleSpace,
  Goal,
  Dream,
  CalendarEvent,
  HomePlanItem,
  FinanceItem,
  Trip,
  Memory,
  Letter,
  TimelineItem,
  NoteBoardItem,
} from "@/types";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Core application data state
  const [coupleSpace, setCoupleSpace] = useState<CoupleSpace | null>(null);
  const [partners, setPartners] = useState<User[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [homePlans, setHomePlans] = useState<HomePlanItem[]>([]);
  const [finances, setFinances] = useState<FinanceItem[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [notes, setNotes] = useState<NoteBoardItem[]>([]);

  // Fetch all couple data
  const fetchAllData = useCallback(async () => {
    try {
      const [
        coupleRes,
        goalsRes,
        dreamsRes,
        calRes,
        homeRes,
        finRes,
        tripsRes,
        memRes,
        lettersRes,
        timelineRes,
        notesRes,
      ] = await Promise.all([
        fetch("/api/couple").then((r) => r.json()),
        fetch("/api/goals").then((r) => r.json()),
        fetch("/api/dreams").then((r) => r.json()),
        fetch("/api/calendar").then((r) => r.json()),
        fetch("/api/home-plans").then((r) => r.json()),
        fetch("/api/finances").then((r) => r.json()),
        fetch("/api/trips").then((r) => r.json()),
        fetch("/api/memories").then((r) => r.json()),
        fetch("/api/letters").then((r) => r.json()),
        fetch("/api/timeline").then((r) => r.json()),
        fetch("/api/notes").then((r) => r.json()),
      ]);

      if (coupleRes.couple) setCoupleSpace(coupleRes.couple);
      if (coupleRes.partners) setPartners(coupleRes.partners);
      if (Array.isArray(goalsRes)) setGoals(goalsRes);
      if (Array.isArray(dreamsRes)) setDreams(dreamsRes);
      if (Array.isArray(calRes)) setEvents(calRes);
      if (Array.isArray(homeRes)) setHomePlans(homeRes);
      if (Array.isArray(finRes)) setFinances(finRes);
      if (Array.isArray(tripsRes)) setTrips(tripsRes);
      if (Array.isArray(memRes)) setMemories(memRes);
      if (Array.isArray(lettersRes)) setLetters(lettersRes);
      if (Array.isArray(timelineRes)) setTimeline(timelineRes);
      if (Array.isArray(notesRes)) setNotes(notesRes);
    } catch (err) {
      console.error("Error fetching TWOgether data:", err);
    }
  }, []);

  // Check saved session on mount
  useEffect(() => {
    const saved = localStorage.getItem("twogether_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
      } catch {
        localStorage.removeItem("twogether_user");
      }
    }
    fetchAllData().finally(() => setLoading(false));
  }, [fetchAllData]);

  // Keep currentUser state in sync when partners update
  useEffect(() => {
    if (currentUser && partners.length > 0) {
      const match = partners.find((p) => p.email === currentUser.email);
      if (match && match.currentMood !== currentUser.currentMood) {
        setCurrentUser((prev) => (prev ? { ...prev, currentMood: match.currentMood } : null));
      }
    }
  }, [partners, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("twogether_user");
    setCurrentUser(null);
  };

  const handleMoodUpdated = (newMood: string) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, currentMood: newMood });
    }
    setPartners((prev) =>
      prev.map((p) => (p.email === currentUser?.email ? { ...p, currentMood: newMood } : p))
    );
  };

  // CRUD Handlers
  const handleAddGoal = async (goal: Partial<Goal>) => {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goal),
    });
    if (res.ok) {
      const saved = await res.json();
      setGoals((prev) => [saved, ...prev]);
    }
  };

  const handleUpdateGoal = async (id: number, updates: Partial<Goal>) => {
    const res = await fetch(`/api/goals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    }
  };

  const handleDeleteGoal = async (id: number) => {
    const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
    if (res.ok) {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const handleAddDream = async (dream: Partial<Dream>) => {
    const res = await fetch("/api/dreams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dream),
    });
    if (res.ok) {
      const saved = await res.json();
      setDreams((prev) => [saved, ...prev]);
    }
  };

  const handleToggleDream = async (id: number, completed: boolean) => {
    const res = await fetch(`/api/dreams/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    if (res.ok) {
      const updated = await res.json();
      setDreams((prev) => prev.map((d) => (d.id === id ? updated : d)));
    }
  };

  const handleDeleteDream = async (id: number) => {
    const res = await fetch(`/api/dreams/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDreams((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleAddEvent = async (event: Partial<CalendarEvent>) => {
    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (res.ok) {
      const saved = await res.json();
      setEvents((prev) => [...prev, saved]);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    const res = await fetch(`/api/calendar/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleAddHomeItem = async (item: Partial<HomePlanItem>) => {
    const res = await fetch("/api/home-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      const saved = await res.json();
      setHomePlans((prev) => [saved, ...prev]);
    }
  };

  const handleToggleHomeItem = async (id: number, purchased: boolean) => {
    const res = await fetch(`/api/home-plans/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchased }),
    });
    if (res.ok) {
      const updated = await res.json();
      setHomePlans((prev) => prev.map((h) => (h.id === id ? updated : h)));
    }
  };

  const handleDeleteHomeItem = async (id: number) => {
    const res = await fetch(`/api/home-plans/${id}`, { method: "DELETE" });
    if (res.ok) {
      setHomePlans((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const handleAddFinance = async (item: Partial<FinanceItem>) => {
    const res = await fetch("/api/finances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      const saved = await res.json();
      setFinances((prev) => [saved, ...prev]);
    }
  };

  const handleDeleteFinance = async (id: number) => {
    const res = await fetch(`/api/finances/${id}`, { method: "DELETE" });
    if (res.ok) {
      setFinances((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleAddTrip = async (trip: Partial<Trip>) => {
    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trip),
    });
    if (res.ok) {
      const saved = await res.json();
      setTrips((prev) => [saved, ...prev]);
    }
  };

  const handleUpdateTrip = async (id: number, updates: Partial<Trip>) => {
    const res = await fetch(`/api/trips/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  };

  const handleDeleteTrip = async (id: number) => {
    const res = await fetch(`/api/trips/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleAddMemory = async (memory: Partial<Memory>) => {
    const res = await fetch("/api/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memory),
    });
    if (res.ok) {
      const saved = await res.json();
      setMemories((prev) => [saved, ...prev]);
    }
  };

  const handleToggleFavoriteMemory = async (id: number, favorite: boolean) => {
    const res = await fetch(`/api/memories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorite }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
    }
  };

  const handleDeleteMemory = async (id: number) => {
    const res = await fetch(`/api/memories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMemories((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleAddLetter = async (letter: Partial<Letter>) => {
    const res = await fetch("/api/letters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(letter),
    });
    if (res.ok) {
      const saved = await res.json();
      setLetters((prev) => [saved, ...prev]);
    }
  };

  const handleMarkLetterRead = async (id: number) => {
    const res = await fetch(`/api/letters/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: true }),
    });
    if (res.ok) {
      setLetters((prev) => prev.map((l) => (l.id === id ? { ...l, isRead: true } : l)));
    }
  };

  const handleDeleteLetter = async (id: number) => {
    const res = await fetch(`/api/letters/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLetters((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleAddTimelineItem = async (item: Partial<TimelineItem>) => {
    const res = await fetch("/api/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      const saved = await res.json();
      setTimeline((prev) => [...prev, saved]);
    }
  };

  const handleDeleteTimelineItem = async (id: number) => {
    const res = await fetch(`/api/timeline/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTimeline((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleAddNote = async (content: string, color: string) => {
    if (!currentUser) return;
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: currentUser.name,
        content,
        color,
        pinned: true,
      }),
    });
    if (res.ok) {
      const saved = await res.json();
      setNotes((prev) => [saved, ...prev]);
    }
  };

  const handleDeleteNote = async (id: number) => {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  // Loading screen in soft pastel
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-gradient">
        <div className="text-center space-y-2.5">
          <div className="w-10 h-10 rounded-full border-3 border-[#e2a8a8] border-t-transparent animate-spin mx-auto" />
          <p className="font-serif text-[#a46868] font-bold text-base">TWOgether</p>
          <p className="text-stone-400 text-[10px] tracking-wider uppercase">Our future, together.</p>
        </div>
      </div>
    );
  }

  // If unauthenticated, render the private Login screen
  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      {/* Top Header & Navigation */}
      <Navbar
        currentUser={currentUser}
        coupleSpace={coupleSpace}
        partners={partners}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenMoodModal={() => setIsMoodModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {activeTab === "dashboard" && (
          <DashboardView
            currentUser={currentUser}
            coupleSpace={coupleSpace}
            partners={partners}
            goals={goals}
            dreams={dreams}
            events={events}
            homePlans={homePlans}
            finances={finances}
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            setActiveTab={setActiveTab}
            onOpenMoodModal={() => setIsMoodModalOpen(true)}
          />
        )}

        {activeTab === "goals" && (
          <GoalsView
            goals={goals}
            currentUser={currentUser}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === "dreams" && (
          <DreamsView
            dreams={dreams}
            currentUser={currentUser}
            onAddDream={handleAddDream}
            onToggleDream={handleToggleDream}
            onDeleteDream={handleDeleteDream}
          />
        )}

        {activeTab === "calendar" && (
          <CalendarView
            events={events}
            currentUser={currentUser}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {activeTab === "house" && (
          <HousePlanningView
            items={homePlans}
            currentUser={currentUser}
            onAddItem={handleAddHomeItem}
            onTogglePurchased={handleToggleHomeItem}
            onDeleteItem={handleDeleteHomeItem}
          />
        )}

        {activeTab === "finances" && (
          <FinancesView
            finances={finances}
            currentUser={currentUser}
            onAddFinance={handleAddFinance}
            onDeleteFinance={handleDeleteFinance}
          />
        )}

        {activeTab === "trips" && (
          <TripsView
            trips={trips}
            currentUser={currentUser}
            onAddTrip={handleAddTrip}
            onUpdateTrip={handleUpdateTrip}
            onDeleteTrip={handleDeleteTrip}
          />
        )}

        {activeTab === "memories" && (
          <MemoriesView
            memories={memories}
            currentUser={currentUser}
            onAddMemory={handleAddMemory}
            onToggleFavorite={handleToggleFavoriteMemory}
            onDeleteMemory={handleDeleteMemory}
          />
        )}

        {activeTab === "letters" && (
          <LettersView
            letters={letters}
            currentUser={currentUser}
            onAddLetter={handleAddLetter}
            onMarkRead={handleMarkLetterRead}
            onDeleteLetter={handleDeleteLetter}
          />
        )}

        {activeTab === "timeline" && (
          <TimelineView
            items={timeline}
            currentUser={currentUser}
            onAddItem={handleAddTimelineItem}
            onDeleteItem={handleDeleteTimelineItem}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ede1da] bg-[#fbf9f6] py-5 text-center text-xs text-stone-400">
        <p className="font-medium text-stone-600">
          TWOgether 1.0 • Pedro &amp; Emilly
        </p>
        <p className="text-[11px] text-[#a46868] mt-0.5">
          Our future, together.
        </p>
      </footer>

      {/* Emotional Status / Mood Modal */}
      <MoodModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        currentUser={currentUser}
        onMoodUpdated={handleMoodUpdated}
      />
    </div>
  );
}

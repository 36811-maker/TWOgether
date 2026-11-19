export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  role: string;
  currentMood: string | null;
  moodUpdatedAt?: string;
}

export interface CoupleSpace {
  id: number;
  name: string;
  slogan: string;
  inviteCode: string;
  anniversaryDate: string;
  storySummary: string;
}

export interface Goal {
  id: number;
  title: string;
  description: string | null;
  category: string;
  targetDate: string | null;
  progress: number;
  status: string;
  createdBy: string;
  createdAt?: string;
}

export interface Dream {
  id: number;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  estimatedCost: string | null;
  completed: boolean;
  completedDate: string | null;
  imageUrl: string | null;
  createdBy: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  category: string;
  isMilestone: boolean;
  countdown: boolean;
  location: string | null;
  createdBy: string;
}

export interface HomePlanItem {
  id: number;
  room: string;
  item: string;
  description: string | null;
  priority: string;
  estimatedPrice: string | null;
  purchased: boolean;
  inspirationUrl: string | null;
  notes: string | null;
  createdBy: string;
}

export interface FinanceItem {
  id: number;
  title: string;
  type: string;
  amount: string;
  targetAmount: string | null;
  category: string;
  payer: string;
  date: string | null;
  notes: string | null;
}

export interface Trip {
  id: number;
  destination: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  budget: string | null;
  coverImage: string | null;
  itinerary: string;
  packingList: string;
  placesToVisit: string;
  notes: string | null;
  createdBy: string;
}

export interface Memory {
  id: number;
  title: string;
  date: string;
  location: string | null;
  imageUrl: string;
  caption: string | null;
  category: string;
  favorite: boolean;
  createdBy: string;
}

export interface Letter {
  id: number;
  title: string;
  sender: string;
  recipient: string;
  content: string;
  type: string;
  openCondition: string | null;
  unlockDate: string | null;
  isRead: boolean;
  createdAt?: string;
}

export interface TimelineItem {
  id: number;
  date: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  order: number;
}

export interface NoteBoardItem {
  id: number;
  author: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt?: string;
}

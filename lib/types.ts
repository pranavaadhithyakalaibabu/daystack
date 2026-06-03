export type Priority = "high" | "med" | "low";

export interface PlannedTask {
  task: string;
  priority: Priority;
  estimated_minutes: number;
}

export interface Meeting {
  title: string;
  time: string;
}

export interface DayPlan {
  top3: string[];
  tasks: PlannedTask[];
  meetings: Meeting[];
  drop: string;
  finish_time: string;
  total_tasks: number;
}

export interface CarryTask {
  task: string;
  priority: Priority;
}

export interface DayReview {
  wins: string[];
  carries: CarryTask[];
  reflection: string;
  completion_rate: number;
  encouragement: string;
}

export interface DayEntry {
  id: string;
  user_id: string;
  date: string;
  raw_dump: string | null;
  ai_plan: DayPlan | null;
  tasks: PlannedTask[] | null;
  completed_tasks: string[];
  review: DayReview | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  streak: number;
  last_active: string | null;
  created_at: string;
}

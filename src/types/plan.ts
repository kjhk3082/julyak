export interface GoalFormData {
  goalName: string;
  goalAmount: number;
  goalPeriod: number; // in months
}

export interface WeeklyMission {
  id: string;
  description: string;
  targetAmount: number;
  weekNumber: number;
  isCompleted: boolean;
}

export interface Plan {
  id: string;
  goalName: string;
  goalAmount: number;
  goalPeriod: number;
  monthlySavings: number;
  weeklySavings: number;
  dDay: number;
  currentSavings: number;
  progressPercentage: number;
  weeklyMissions: WeeklyMission[];
  createdAt: string;
  targetDate: string;
}

export interface CreatePlanRequest {
  goalName: string;
  goalAmount: number;
  goalPeriod: number;
}

export interface CreatePlanResponse {
  success: boolean;
  plan?: Plan;
  error?: string;
}
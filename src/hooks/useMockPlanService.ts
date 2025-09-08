import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreatePlanRequest, CreatePlanResponse, Plan, WeeklyMission } from '@/types/plan';

// Mock data
const generateWeeklyMissions = (weeklySavings: number, goalPeriod: number): WeeklyMission[] => {
  const missions: WeeklyMission[] = [];
  const totalWeeks = goalPeriod * 4; // Approximate 4 weeks per month
  
  for (let i = 1; i <= Math.min(totalWeeks, 12); i++) {
    missions.push({
      id: `mission-${i}`,
      description: `이번 주에 ${weeklySavings.toLocaleString()}원 저축하기`,
      targetAmount: weeklySavings,
      weekNumber: i,
      isCompleted: false,
    });
  }
  
  return missions;
};

// Mock API service
const mockPlanService = {
  createPlan: async (request: CreatePlanRequest): Promise<CreatePlanResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validation
    if (!request.goalName || !request.goalAmount || !request.goalPeriod) {
      return {
        success: false,
        error: '모든 필수 필드를 입력해주세요.',
      };
    }
    
    if (request.goalAmount <= 0) {
      return {
        success: false,
        error: '목표 금액은 0보다 커야 합니다.',
      };
    }
    
    if (request.goalPeriod <= 0) {
      return {
        success: false,
        error: '목표 기간은 0보다 커야 합니다.',
      };
    }
    
    const monthlySavings = Math.ceil(request.goalAmount / request.goalPeriod);
    const weeklySavings = Math.ceil(monthlySavings / 4);
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + request.goalPeriod);
    
    const plan: Plan = {
      id: `plan-${Date.now()}`,
      goalName: request.goalName,
      goalAmount: request.goalAmount,
      goalPeriod: request.goalPeriod,
      monthlySavings,
      weeklySavings,
      dDay: request.goalPeriod * 30, // Approximate days
      currentSavings: 0,
      progressPercentage: 0,
      weeklyMissions: generateWeeklyMissions(weeklySavings, request.goalPeriod),
      createdAt: new Date().toISOString(),
      targetDate: targetDate.toISOString(),
    };
    
    return {
      success: true,
      plan,
    };
  },
  
  getCurrentPlan: async (): Promise<Plan | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock current plan or null
    const storedPlan = localStorage.getItem('currentPlan');
    return storedPlan ? JSON.parse(storedPlan) : null;
  },
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CreatePlanResponse, Error, CreatePlanRequest>({
    mutationFn: mockPlanService.createPlan,
    onSuccess: (data) => {
      if (data.success && data.plan) {
        // Store the plan in localStorage for persistence
        localStorage.setItem('currentPlan', JSON.stringify(data.plan));
        // Invalidate and refetch current plan
        queryClient.invalidateQueries({ queryKey: ['currentPlan'] });
      }
    },
  });
};

export const useCurrentPlan = () => {
  return useQuery<Plan | null, Error>({
    queryKey: ['currentPlan'],
    queryFn: mockPlanService.getCurrentPlan,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMockPlanService = () => {
  return {
    useCreatePlan,
    useCurrentPlan,
  };
};
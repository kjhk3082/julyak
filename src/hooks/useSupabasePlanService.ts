'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Plan, CreatePlanRequest, CreatePlanResponse, WeeklyMission } from '@/types/plan';
import { Database } from '@/lib/supabase/database.types';

type GoalRow = Database['public']['Tables']['goals']['Row'];
type WeeklyMissionRow = Database['public']['Tables']['weekly_missions']['Row'];

const supabase = createClient();

// Helper function to convert database rows to Plan type
const convertToPlan = (
  goal: GoalRow,
  weeklyMissions: WeeklyMissionRow[]
): Plan => {
  const createdAt = new Date(goal.created_at);
  const targetDate = new Date(createdAt);
  targetDate.setMonth(targetDate.getMonth() + goal.goal_period);
  
  const now = new Date();
  const timeDiff = targetDate.getTime() - now.getTime();
  const dDay = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const monthlySavings = goal.goal_amount / goal.goal_period;
  const weeklySavings = monthlySavings / 4;
  const progressPercentage = (goal.current_amount / goal.goal_amount) * 100;

  const missions: WeeklyMission[] = weeklyMissions.map(mission => ({
    id: mission.id,
    description: mission.mission_text,
    targetAmount: weeklySavings,
    weekNumber: mission.week_number,
    isCompleted: mission.is_completed
  }));

  return {
    id: goal.id,
    goalName: goal.goal_name,
    goalAmount: goal.goal_amount,
    goalPeriod: goal.goal_period,
    monthlySavings,
    weeklySavings,
    dDay,
    currentSavings: goal.current_amount,
    progressPercentage,
    weeklyMissions: missions,
    createdAt: goal.created_at,
    targetDate: targetDate.toISOString(),
  };
};

// Generate weekly missions
const generateWeeklyMissions = (goalPeriod: number, weeklySavings: number) => {
  const missions: string[] = [
    `이번 주 ${weeklySavings.toLocaleString()}원 절약하기`,
    '가계부 작성하고 지출 패턴 분석하기',
    '불필요한 구독 서비스 해지하기',
    '외식 대신 집밥 먹기 (주 3회 이상)',
    '쇼핑 전 필수품 목록 작성하기',
    '중고거래로 안 쓰는 물건 판매하기',
    '할인 쿠폰이나 적립금 활용하기',
    '브랜드 제품 대신 PB 제품 구매하기',
    '커피숍 대신 텀블러 이용하기',
    '대중교통 이용으로 교통비 절약하기',
    '에너지 절약으로 공과금 줄이기',
    '무료 문화시설 이용하기'
  ];

  const totalWeeks = goalPeriod * 4;
  const weeklyMissionsList = [];
  
  for (let i = 0; i < totalWeeks; i++) {
    weeklyMissionsList.push({
      week_number: i + 1,
      mission_text: missions[i % missions.length]
    });
  }
  
  return weeklyMissionsList;
};

export const useSupabasePlanService = () => {
  const queryClient = useQueryClient();

  // Get all plans for the current user
  const getPlans = useQuery({
    queryKey: ['plans'],
    queryFn: async (): Promise<Plan[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('사용자가 로그인되어 있지 않습니다.');
      }

      const { data: goals, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`목표 조회 실패: ${error.message}`);
      }

      const plans: Plan[] = [];
      
      for (const goal of goals || []) {
        const { data: missions, error: missionError } = await supabase
          .from('weekly_missions')
          .select('*')
          .eq('goal_id', goal.id)
          .order('week_number');

        if (missionError) {
          throw new Error(`미션 조회 실패: ${missionError.message}`);
        }

        plans.push(convertToPlan(goal, missions || []));
      }

      return plans;
    },
  });

  // Create a new plan
  const createPlan = useMutation({
    mutationFn: async (request: CreatePlanRequest): Promise<CreatePlanResponse> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('사용자가 로그인되어 있지 않습니다.');
        }

        // Create goal
        const { data: goal, error: goalError } = await supabase
          .from('goals')
          .insert([
            {
              user_id: user.id,
              goal_name: request.goalName,
              goal_amount: request.goalAmount,
              goal_period: request.goalPeriod,
              current_amount: 0,
              is_active: true,
            },
          ])
          .select()
          .single();

        if (goalError || !goal) {
          throw new Error(`목표 생성 실패: ${goalError?.message || '알 수 없는 오류'}`);
        }

        const monthlySavings = request.goalAmount / request.goalPeriod;
        const weeklySavings = monthlySavings / 4;

        // Create savings plan
        const { error: planError } = await supabase
          .from('savings_plans')
          .insert([
            {
              goal_id: goal.id,
              user_id: user.id,
              monthly_amount: monthlySavings,
              weekly_amount: weeklySavings,
            },
          ]);

        if (planError) {
          throw new Error(`저축 계획 생성 실패: ${planError.message}`);
        }

        // Generate and create weekly missions
        const weeklyMissions = generateWeeklyMissions(request.goalPeriod, weeklySavings);
        const missionsToInsert = weeklyMissions.map(mission => ({
          goal_id: goal.id,
          user_id: user.id,
          ...mission,
        }));

        const { data: createdMissions, error: missionError } = await supabase
          .from('weekly_missions')
          .insert(missionsToInsert)
          .select();

        if (missionError) {
          throw new Error(`미션 생성 실패: ${missionError.message}`);
        }

        const plan = convertToPlan(goal, createdMissions || []);

        return {
          success: true,
          plan,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });

  // Update mission completion status
  const updateMissionStatus = useMutation({
    mutationFn: async ({
      missionId,
      isCompleted,
    }: {
      missionId: string;
      isCompleted: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('사용자가 로그인되어 있지 않습니다.');
      }

      const { error } = await supabase
        .from('weekly_missions')
        .update({
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq('id', missionId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(`미션 상태 업데이트 실패: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });

  // Update savings amount
  const updateSavingsAmount = useMutation({
    mutationFn: async ({
      goalId,
      amount,
    }: {
      goalId: string;
      amount: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('사용자가 로그인되어 있지 않습니다.');
      }

      const { error } = await supabase
        .from('goals')
        .update({
          current_amount: amount,
        })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(`저축 금액 업데이트 실패: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });

  return {
    plans: getPlans.data || [],
    isLoading: getPlans.isLoading,
    error: getPlans.error,
    createPlan: createPlan.mutate,
    isCreating: createPlan.isPending,
    createError: createPlan.error,
    updateMissionStatus: updateMissionStatus.mutate,
    updateSavingsAmount: updateSavingsAmount.mutate,
  };
};
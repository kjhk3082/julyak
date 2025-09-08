'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Plan, CreatePlanRequest, CreatePlanResponse, WeeklyMission } from '@/types/plan';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';

// Helper function to convert Firestore document to Plan type
const convertToPlan = (goalDoc: any, weeklyMissionsData: any[]): Plan => {
  const goalData = goalDoc.data();
  const createdAt = goalData.createdAt.toDate();
  const targetDate = new Date(createdAt);
  targetDate.setMonth(targetDate.getMonth() + goalData.goalPeriod);
  
  const now = new Date();
  const timeDiff = targetDate.getTime() - now.getTime();
  const dDay = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const monthlySavings = goalData.goalAmount / goalData.goalPeriod;
  const weeklySavings = monthlySavings / 4;
  const progressPercentage = (goalData.currentAmount / goalData.goalAmount) * 100;

  const missions: WeeklyMission[] = weeklyMissionsData.map(mission => ({
    id: mission.id,
    description: mission.missionText,
    targetAmount: weeklySavings,
    weekNumber: mission.weekNumber,
    isCompleted: mission.isCompleted
  }));

  return {
    id: goalDoc.id,
    goalName: goalData.goalName,
    goalAmount: goalData.goalAmount,
    goalPeriod: goalData.goalPeriod,
    monthlySavings,
    weeklySavings,
    dDay,
    currentSavings: goalData.currentAmount,
    progressPercentage,
    weeklyMissions: missions,
    createdAt: goalData.createdAt.toDate().toISOString(),
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
      weekNumber: i + 1,
      missionText: missions[i % missions.length],
      isCompleted: false
    });
  }
  
  return weeklyMissionsList;
};

export const useFirebasePlanService = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get all plans for the current user
  const getPlans = useQuery({
    queryKey: ['firebase-plans', user?.uid],
    queryFn: async (): Promise<Plan[]> => {
      if (!user) {
        throw new Error('사용자가 로그인되어 있지 않습니다.');
      }

      const goalsRef = collection(db, 'goals');
      const q = query(
        goalsRef,
        where('userId', '==', user.uid),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const goalSnapshot = await getDocs(q);
      const plans: Plan[] = [];
      
      for (const goalDoc of goalSnapshot.docs) {
        // Get weekly missions for this goal
        const missionsRef = collection(db, 'weeklyMissions');
        const missionQuery = query(
          missionsRef,
          where('goalId', '==', goalDoc.id),
          orderBy('weekNumber')
        );
        
        const missionSnapshot = await getDocs(missionQuery);
        const weeklyMissionsData = missionSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        plans.push(convertToPlan(goalDoc, weeklyMissionsData));
      }

      return plans;
    },
    enabled: !!user,
  });

  // Create a new plan
  const createPlan = useMutation({
    mutationFn: async (request: CreatePlanRequest): Promise<CreatePlanResponse> => {
      try {
        if (!user) {
          throw new Error('사용자가 로그인되어 있지 않습니다.');
        }

        // Create goal document
        const goalsRef = collection(db, 'goals');
        const goalDoc = await addDoc(goalsRef, {
          userId: user.uid,
          goalName: request.goalName,
          goalAmount: request.goalAmount,
          goalPeriod: request.goalPeriod,
          currentAmount: 0,
          isActive: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        const monthlySavings = request.goalAmount / request.goalPeriod;
        const weeklySavings = monthlySavings / 4;

        // Create savings plan document
        const savingsPlansRef = collection(db, 'savingsPlans');
        await addDoc(savingsPlansRef, {
          goalId: goalDoc.id,
          userId: user.uid,
          monthlyAmount: monthlySavings,
          weeklyAmount: weeklySavings,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        // Generate and create weekly missions
        const weeklyMissions = generateWeeklyMissions(request.goalPeriod, weeklySavings);
        const weeklyMissionsRef = collection(db, 'weeklyMissions');
        
        const missionPromises = weeklyMissions.map(mission => 
          addDoc(weeklyMissionsRef, {
            goalId: goalDoc.id,
            userId: user.uid,
            ...mission,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          })
        );

        await Promise.all(missionPromises);

        // Fetch the created goal to convert to Plan format
        const createdGoalDoc = await getDocs(query(
          collection(db, 'goals'),
          where('__name__', '==', goalDoc.id)
        ));

        const missionSnapshot = await getDocs(query(
          collection(db, 'weeklyMissions'),
          where('goalId', '==', goalDoc.id),
          orderBy('weekNumber')
        ));

        const weeklyMissionsData = missionSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const plan = convertToPlan(createdGoalDoc.docs[0], weeklyMissionsData);

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
      queryClient.invalidateQueries({ queryKey: ['firebase-plans', user?.uid] });
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
      if (!user) {
        throw new Error('사용자가 로그인되어 있지 않습니다.');
      }

      const missionRef = doc(db, 'weeklyMissions', missionId);
      await updateDoc(missionRef, {
        isCompleted,
        completedAt: isCompleted ? Timestamp.now() : null,
        updatedAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firebase-plans', user?.uid] });
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
      if (!user) {
        throw new Error('사용자가 로그인되어 있지 않습니다.');
      }

      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, {
        currentAmount: amount,
        updatedAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firebase-plans', user?.uid] });
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
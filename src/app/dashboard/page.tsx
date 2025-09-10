'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Progress } from '@/components/ui/progress';
import { PlanDisplay } from '@/components/PlanDisplay';
import { useFirebasePlanService } from '@/hooks/useFirebasePlanService';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Target, CheckCircle, Clock, Map, TrendingUp, Coffee, ShoppingCart, Loader2 } from 'lucide-react';

const missions = [
  {
    id: 1,
    title: '카페 대신 집에서 커피 내리기',
    description: '카페 이용을 줄이고 홈카페를 즐겨보세요',
    reward: 1.5,
    icon: Coffee,
    completed: false,
    difficulty: '쉬움',
  },
  {
    id: 2,
    title: '장보기 전 쇼핑 리스트 작성하기',
    description: '계획적인 장보기로 불필요한 구매를 줄여보세요',
    reward: 2.0,
    icon: ShoppingCart,
    completed: true,
    difficulty: '쉬움',
  },
  {
    id: 3,
    title: '전기 요금 10% 절약하기',
    description: '사용하지 않는 전자제품 플러그 뽑기',
    reward: 3.5,
    icon: TrendingUp,
    completed: false,
    difficulty: '보통',
  },
];

// Remove this line - will be calculated from currentPlan data

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthGuard();
  const { plans, isLoading, error } = useFirebasePlanService();
  const currentPlan = plans?.[0]; // Get the first active plan
  
  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  // User is authenticated at this point due to useAuthGuard

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section with Glassmorphism */}
        <GlassCard className="p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            안녕하세요, {user?.displayName || user?.email?.split('@')[0] || '절약가'}님! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            오늘도 목표 달성을 위해 한 걸음 더 나아가요
          </p>
        </GlassCard>

        {/* Current Plan or Loading */}
        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">목표 정보를 불러오는 중...</p>
            </CardContent>
          </Card>
        ) : currentPlan ? (
          <PlanDisplay plan={currentPlan} />
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-xl">목표를 설정해보세요</CardTitle>
                  <CardDescription>새로운 절약 목표를 만들어 시작하세요</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-8 text-gray-500">
                <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">아직 설정된 목표가 없습니다</p>
                <p className="text-sm mb-4">첫 번째 절약 목표를 설정해보세요</p>
                <Link href="/goal">
                  <Button>
                    목표 설정하기
                  </Button>
                </Link>
              </div>
              
            </CardContent>
          </Card>
        )}

        {/* Daily Missions with Glassmorphism */}
        <GlassCard variant="subtle">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-accent" />
              오늘의 절약 미션
            </CardTitle>
            <CardDescription>
              미션을 완료하고 목표에 더 가까워지세요!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missions.map((mission) => {
                const Icon = mission.icon;
                return (
                  <div
                    key={mission.id}
                    className={`p-4 rounded-lg border ${
                      mission.completed
                        ? 'bg-accent/5 border-accent/20'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${
                        mission.completed ? 'bg-accent/10' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          mission.completed ? 'text-accent' : 'text-gray-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className={`font-medium ${
                            mission.completed ? 'text-accent line-through' : 'text-gray-900'
                          }`}>
                            {mission.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                              {mission.difficulty}
                            </span>
                            <span className="text-sm font-bold text-primary">
                              +{mission.reward}만원
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm ${
                          mission.completed ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {mission.description}
                        </p>
                      </div>
                      
                      {mission.completed ? (
                        <CheckCircle className="w-5 h-5 text-accent" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </GlassCard>

        {/* Quick Actions with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard variant="subtle" hover>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-6 h-6 mr-2 text-primary" />
                목표 관리
              </CardTitle>
              <CardDescription>
                목표를 수정하거나 새로운 목표를 설정하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/goal">목표 설정하기</Link>
              </Button>
            </CardContent>
          </GlassCard>

          <GlassCard variant="subtle" hover>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="w-6 h-6 mr-2 text-accent" />
                최저가 찾기
              </CardTitle>
              <CardDescription>
                필요한 상품의 최저가를 확인해보세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/map">최저가 맵 보기</Link>
              </Button>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
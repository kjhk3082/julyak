'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { GoalForm } from '@/components/GoalForm';
import { PlanDisplay } from '@/components/PlanDisplay';
import { useFirebasePlanService } from '@/hooks/useFirebasePlanService';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, AlertCircle, Target } from 'lucide-react';

export default function GoalPage() {
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { plans, isLoading, error } = useFirebasePlanService();
  const currentPlan = plans?.[0]; // Get the first active plan

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleFormSuccess = () => {
    setShowForm(false);
  };

  const handleCreateNew = () => {
    setShowForm(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h2 font-bold text-gray-900 mb-2">목표 관리</h1>
            <p className="text-gray-600">목표를 설정하고 관리해보세요</p>
          </div>
          {!showForm && !currentPlan && (
            <Button onClick={handleCreateNew} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              새 목표 추가
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">목표 정보를 불러오는 중...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">오류가 발생했습니다</h3>
              <p className="text-gray-600 mb-4">목표 정보를 불러올 수 없습니다.</p>
              <Button onClick={() => window.location.reload()}>다시 시도</Button>
            </CardContent>
          </Card>
        )}

        {/* Goal Form */}
        {showForm && (
          <GoalForm onSuccess={handleFormSuccess} />
        )}

        {/* Current Plan Display */}
        {!isLoading && !error && currentPlan && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">현재 절약 계획</h2>
              <Button 
                variant="outline" 
                onClick={handleCreateNew}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                새 목표 추가
              </Button>
            </div>
            <PlanDisplay plan={currentPlan} />
          </>
        )}

        {/* Empty State - No Plan */}
        {!isLoading && !error && !currentPlan && !showForm && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">아직 설정된 목표가 없습니다</h3>
              <p className="text-gray-600 mb-6">
                첫 번째 절약 목표를 설정하고 계획을 시작해보세요
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                목표 설정하기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
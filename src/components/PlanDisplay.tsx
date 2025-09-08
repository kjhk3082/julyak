'use client';

import { Plan } from '@/types/plan';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Calendar, DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react';

interface PlanDisplayProps {
  plan: Plan;
}

export function PlanDisplay({ plan }: PlanDisplayProps) {
  const formatCurrency = (amount: number) => `${amount.toLocaleString()}만원`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ko-KR');
  
  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining(plan.targetDate);
  const completedMissions = plan.weeklyMissions.filter(mission => mission.isCompleted).length;
  const totalMissions = plan.weeklyMissions.length;

  return (
    <div className="space-y-6">
      {/* Main Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-xl">{plan.goalName}</CardTitle>
                <CardDescription>
                  목표 달성까지 D-{daysRemaining}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{plan.progressPercentage.toFixed(0)}%</p>
              <p className="text-sm text-gray-600">달성률</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">현재 절약 금액</span>
              <span className="text-sm font-medium">
                {formatCurrency(plan.currentSavings)} / {formatCurrency(plan.goalAmount)}
              </span>
            </div>
            <Progress value={plan.progressPercentage} className="h-3" />
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-accent mr-3" />
              <div>
                <p className="text-sm text-gray-600">현재 절약액</p>
                <p className="text-lg font-bold">{formatCurrency(plan.currentSavings)}</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-600">월별 목표</p>
                <p className="text-lg font-bold">{formatCurrency(plan.monthlySavings)}</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-8 h-8 text-secondary mr-3" />
              <div>
                <p className="text-sm text-gray-600">주간 목표</p>
                <p className="text-lg font-bold">{formatCurrency(plan.weeklySavings)}</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Target className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">목표 날짜</p>
                <p className="text-lg font-bold">{formatDate(plan.targetDate)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Missions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-accent" />
                주간 절약 미션
              </CardTitle>
              <CardDescription>
                완료된 미션: {completedMissions}/{totalMissions}
              </CardDescription>
            </div>
            <Badge variant="outline">
              {Math.round((completedMissions / totalMissions) * 100)}% 완료
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {plan.weeklyMissions.slice(0, 6).map((mission) => (
              <div
                key={mission.id}
                className={`p-4 rounded-lg border ${
                  mission.isCompleted
                    ? 'bg-accent/5 border-accent/20'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      mission.isCompleted ? 'bg-accent/10' : 'bg-gray-100'
                    }`}>
                      {mission.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-accent" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className={`font-medium ${
                        mission.isCompleted ? 'text-accent line-through' : 'text-gray-900'
                      }`}>
                        {mission.description}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {mission.weekNumber}주차 미션
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-sm font-bold text-primary">
                      {formatCurrency(mission.targetAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {plan.weeklyMissions.length > 6 && (
              <div className="text-center py-2">
                <Badge variant="outline">
                  +{plan.weeklyMissions.length - 6}개 더 보기
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFirebasePlanService } from '@/hooks/useFirebasePlanService';
import { GoalFormData, CreatePlanRequest } from '@/types/plan';
import { Target, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const goalFormSchema = z.object({
  goalName: z.string().min(1, '목표 이름을 입력해주세요.'),
  goalAmount: z.number({
    required_error: '목표 금액을 입력해주세요.',
    invalid_type_error: '올바른 금액을 입력해주세요.',
  }).min(1, '목표 금액은 1원 이상이어야 합니다.'),
  goalPeriod: z.number({
    required_error: '목표 기간을 입력해주세요.',
    invalid_type_error: '올바른 기간을 입력해주세요.',
  }).min(1, '목표 기간은 1개월 이상이어야 합니다.').max(60, '목표 기간은 60개월 이하여야 합니다.'),
});

interface GoalFormProps {
  onSuccess?: () => void;
}

export function GoalForm({ onSuccess }: GoalFormProps) {
  const { toast } = useToast();
  const { createPlan, isCreating, createError } = useFirebasePlanService();
  
  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      goalName: '',
      goalAmount: undefined,
      goalPeriod: undefined,
    },
  });

  const onSubmit = async (data: GoalFormData) => {
    const request: CreatePlanRequest = {
      goalName: data.goalName,
      goalAmount: data.goalAmount,
      goalPeriod: data.goalPeriod,
    };

    createPlan(request, {
      onSuccess: (result) => {
        if (result.success) {
          toast({
            title: '목표가 생성되었습니다!',
            description: `${data.goalName} 목표를 위한 절약 계획이 준비되었습니다.`,
          });
          
          form.reset();
          onSuccess?.();
        } else {
          toast({
            title: '목표 생성에 실패했습니다',
            description: result.error || '알 수 없는 오류가 발생했습니다.',
            variant: 'destructive',
          });
        }
      },
      onError: (error) => {
        toast({
          title: '목표 생성에 실패했습니다',
          description: error.message || '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
          variant: 'destructive',
        });
      }
    });
  };

  const isLoading = isCreating;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="w-6 h-6 mr-2 text-primary" />
          새 목표 설정
        </CardTitle>
        <CardDescription>
          달성하고 싶은 목표를 설정하고 절약 계획을 세워보세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="goalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>목표 이름</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="예: 맥북 구매, 유럽 여행, 비상금 마련"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    달성하고 싶은 목표의 이름을 입력해주세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>목표 금액 (만원)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="200"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    목표 달성에 필요한 금액을 만원 단위로 입력해주세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goalPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>목표 기간 (개월)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="12"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    목표를 달성할 기간을 개월 단위로 입력해주세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview Section */}
            {form.watch('goalAmount') && form.watch('goalPeriod') && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <h4 className="font-medium text-sm text-gray-900">예상 절약 계획</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">월별 저축액</p>
                    <p className="font-semibold text-primary">
                      {Math.ceil((form.watch('goalAmount') || 0) / (form.watch('goalPeriod') || 1)).toLocaleString()}만원
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">주간 저축액</p>
                    <p className="font-semibold text-accent">
                      {Math.ceil(Math.ceil((form.watch('goalAmount') || 0) / (form.watch('goalPeriod') || 1)) / 4).toLocaleString()}만원
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading ? '계획 생성 중...' : '목표 설정하기'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Target } from 'lucide-react';

const steps = [
  { title: '기본 정보', description: '간단한 정보를 입력해주세요' },
  { title: '목표 설정', description: '달성하고 싶은 목표를 설정해주세요' },
  { title: '완료', description: '설정이 완료되었습니다' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    income: '',
    goalType: '',
    goalAmount: '',
    targetDate: '',
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and redirect to dashboard
      router.push('/dashboard');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepComplete = () => {
    if (currentStep === 0) {
      return formData.name && formData.age && formData.income;
    } else if (currentStep === 1) {
      return formData.goalType && formData.goalAmount && formData.targetDate;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 items-center justify-center">
        <div className="text-center text-white p-12">
          <Target className="w-24 h-24 mx-auto mb-8" />
          <h2 className="text-h2 font-bold mb-4">목표 달성의 시작</h2>
          <p className="text-xl">
            절약가 정신과 함께 똑똑하게 목표를 달성해보세요
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep
                        ? 'bg-primary text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-4 ${
                        index < currentStep ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
              <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
            </div>
          </div>

          {/* Form Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 0 && '기본 정보를 알려주세요'}
                {currentStep === 1 && '목표를 설정해주세요'}
                {currentStep === 2 && '설정이 완료되었습니다!'}
              </CardTitle>
              <CardDescription>
                {currentStep === 0 && '개인 맞춤형 서비스를 위해 필요한 정보입니다'}
                {currentStep === 1 && '구체적인 목표를 설정하여 달성 가능성을 높여보세요'}
                {currentStep === 2 && '이제 대시보드에서 절약을 시작해보세요'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 0 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      placeholder="이름을 입력해주세요"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">나이</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="나이를 입력해주세요"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="income">월 소득 (만원)</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="월 소득을 입력해주세요"
                      value={formData.income}
                      onChange={(e) => handleInputChange('income', e.target.value)}
                    />
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="goalType">목표 유형</Label>
                    <Input
                      id="goalType"
                      placeholder="예: 노트북 구매, 여행, 비상금 등"
                      value={formData.goalType}
                      onChange={(e) => handleInputChange('goalType', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goalAmount">목표 금액 (만원)</Label>
                    <Input
                      id="goalAmount"
                      type="number"
                      placeholder="목표 금액을 입력해주세요"
                      value={formData.goalAmount}
                      onChange={(e) => handleInputChange('goalAmount', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetDate">목표 달성 날짜</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => handleInputChange('targetDate', e.target.value)}
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <div className="text-center py-8">
                  <Target className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">준비 완료!</h3>
                  <p className="text-gray-600 mb-6">
                    {formData.name}님의 '{formData.goalType}' 목표 달성을 위한<br />
                    맞춤형 절약 계획이 준비되었습니다.
                  </p>
                </div>
              )}

              <Button
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="w-full"
                size="lg"
              >
                {currentStep === steps.length - 1 ? '시작하기' : '다음'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
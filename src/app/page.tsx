'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { CheckCircle, Target, TrendingUp, Map } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'AI 코치 서비스',
    description: '개인 맞춤형 절약 미션과 목표 달성을 위한 AI 코치가 24시간 도움을 드립니다.',
  },
  {
    icon: TrendingUp,
    title: '생활비 15-25% 절감',
    description: '똑똑한 절약 전략으로 월 생활비를 평균 15-25% 절약할 수 있습니다.',
  },
  {
    icon: Map,
    title: '전국 실시간 최저가 비교',
    description: '전자제품, 생필품 등 필요한 상품의 전국 최저가를 실시간으로 비교해드립니다.',
  },
];

const testimonials = [
  {
    name: '김민수',
    age: '28세, 직장인',
    comment: '3개월 만에 노트북 살 돈을 모았어요! AI 코치가 정말 도움이 됐습니다.',
  },
  {
    name: '이지연',
    age: '25세, 직장인',
    comment: '생활비가 20% 줄어들었어요. 이제 여행 계획도 세울 수 있게 됐습니다!',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-h1 font-bold mb-6">
            똑똑한 절약으로<br />
            목표를 빠르게 달성하세요
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            20~30대 1인 가구 직장인을 위한 AI 절약 코치와 실시간 가격 비교로 
            생활비를 15~25% 절감하고 목표를 달성하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/onboarding">시작하기</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link href="/dashboard">대시보드 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-bold mb-4">왜 절약가 정신인가요?</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              AI 기반의 개인 맞춤형 절약 솔루션으로 더 빠르고 효과적으로 목표를 달성하세요.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-accent/10 rounded-full">
                        <Icon className="w-8 h-8 text-accent" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-bold mb-4">사용자 후기</h2>
            <p className="text-lg text-gray-700">
              이미 많은 분들이 목표를 달성하고 있습니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <CheckCircle className="w-5 h-5 text-accent mr-2 mt-1" />
                    <p className="text-lg italic">"{testimonial.comment}"</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.age}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-h2 font-bold mb-4">지금 시작해보세요</h2>
          <p className="text-xl mb-8">
            무료로 시작하고 첫 번째 목표를 달성해보세요.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/onboarding">무료로 시작하기</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

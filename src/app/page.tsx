'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { CheckCircle, Target, TrendingUp, Map, Sparkles, DollarSign, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400 to-blue-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl" />
      </div>
      <Header />
      
      {/* Hero Section with Glassmorphism */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <GlassCard className="p-12 text-center relative overflow-hidden">
            {/* Sparkle decoration */}
            <Sparkles className="absolute top-8 right-8 w-8 h-8 text-purple-400 opacity-50" />
            <Sparkles className="absolute bottom-8 left-8 w-6 h-6 text-blue-400 opacity-50" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                AI 기반 절약 솔루션
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
                똑똑한 절약으로<br />
                목표를 빠르게 달성하세요
              </h1>
              
              <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
                20~30대 1인 가구 직장인을 위한 <span className="font-semibold text-purple-600">AI 절약 코치</span>와 
                <span className="font-semibold text-blue-600"> 실시간 가격 비교</span>로 
                생활비를 15~25% 절감하고 목표를 달성하세요.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-purple-500/25 px-8"
                >
                  <Link href="/onboarding">
                    <Sparkles className="w-5 h-5 mr-2" />
                    무료로 시작하기
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-gray-300 hover:border-gray-400 bg-white/50 backdrop-blur-sm"
                >
                  <Link href="/dashboard">대시보드 보기</Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-purple-600">15-25%</div>
                  <div className="text-sm text-gray-600 mt-1">평균 생활비 절감</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600 mt-1">AI 코치 지원</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">실시간</div>
                  <div className="text-sm text-gray-600 mt-1">최저가 비교</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features Section with Glassmorphism */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              왜 절약가 정신인가요?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              AI 기반의 개인 맞춤형 절약 솔루션으로 더 빠르고 효과적으로 목표를 달성하세요.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const gradients = [
                'from-purple-500 to-blue-500',
                'from-blue-500 to-green-500',
                'from-green-500 to-yellow-500'
              ];
              return (
                <GlassCard 
                  key={index} 
                  variant="subtle" 
                  hover 
                  className="text-center p-8 group"
                >
                  <div className="flex justify-center mb-6">
                    <div className={`p-4 bg-gradient-to-br ${gradients[index]} rounded-2xl shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Glassmorphism */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              사용자 후기
            </h2>
            <p className="text-lg text-gray-700">
              이미 많은 분들이 목표를 달성하고 있습니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <GlassCard key={index} variant="subtle" className="p-8">
                <div className="flex items-start mb-6">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mr-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg text-gray-700 italic flex-1">
                    "{testimonial.comment}"
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.age}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Glassmorphism */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6">
          <GlassCard variant="primary" className="p-12 text-center">
            <DollarSign className="w-16 h-16 mx-auto mb-6 text-yellow-500" />
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              지금 시작해보세요
            </h2>
            <p className="text-xl mb-8 text-gray-700">
              무료로 시작하고 첫 번째 목표를 달성해보세요.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-yellow-500/25 px-8"
            >
              <Link href="/onboarding">
                <Sparkles className="w-5 h-5 mr-2" />
                무료로 시작하기
              </Link>
            </Button>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}

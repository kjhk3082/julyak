'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Link>
          </Button>
          <div className="flex items-center mb-4">
            <Shield className="w-8 h-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">개인정보처리방침</h1>
              <p className="text-gray-600">최종 수정일: 2024년 10월 1일</p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>개인정보처리방침 개요</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                절약가 정신(이하 "회사")은 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 
                바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」 
                제30조에 따라 정보주체에게 개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 
                원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제1조 (개인정보의 처리목적)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
              
              <h4 className="font-semibold mt-6 mb-3">1. 회원 가입 및 관리</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>회원 가입 의사 확인</li>
                <li>회원제 서비스 제공에 따른 본인 식별·인증</li>
                <li>회원자격 유지·관리</li>
                <li>서비스 부정이용 방지</li>
                <li>각종 고지·통지</li>
              </ul>

              <h4 className="font-semibold mt-6 mb-3">2. 서비스 제공</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>절약 목표 설정 및 관리 서비스</li>
                <li>개인 맞춤형 절약 미션 제공</li>
                <li>AI 기반 절약 코칭 서비스</li>
                <li>가격 비교 서비스</li>
                <li>절약 현황 통계 제공</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제2조 (개인정보의 처리 및 보유기간)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-3">각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>회원 가입 및 관리:</strong> 회원 탈퇴 시까지</li>
                  <li><strong>서비스 제공:</strong> 서비스 이용 종료 시까지</li>
                  <li><strong>불만 또는 분쟁처리:</strong> 3년</li>
                  <li><strong>법령에 의한 보존:</strong> 관련 법령에서 정한 기간</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제3조 (개인정보의 제3자 제공)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                회사는 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 
                정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조에 해당하는 경우에만 
                개인정보를 제3자에게 제공합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제4조 (개인정보의 파기)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ol className="list-decimal pl-6 space-y-3">
                <li>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</li>
                <li>정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</li>
              </ol>
              
              <h4 className="font-semibold mt-6 mb-3">개인정보 파기 절차 및 방법</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>파기절차:</strong> 불필요한 개인정보 및 개인정보파일은 개인정보보호책임자의 책임하에 내부방침 절차에 따라 다음과 같이 처리하고 있습니다.</li>
                <li><strong>파기방법:</strong> 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 로우레벨포맷(Low Level Format) 등의 방법을 이용하여 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제5조 (정보주체의 권리·의무 및 행사방법)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
              <ol className="list-decimal pl-6 mt-4 space-y-2">
                <li>개인정보 처리현황 통지요구</li>
                <li>개인정보 열람요구</li>
                <li>개인정보 정정·삭제요구</li>
                <li>개인정보 처리정지요구</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제6조 (개인정보의 안전성 확보조치)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
                <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
                <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제7조 (개인정보보호책임자)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다:</p>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">개인정보보호책임자</h4>
                <ul className="space-y-1 text-sm">
                  <li><strong>성명:</strong> 김개인</li>
                  <li><strong>직책:</strong> 개인정보보호책임자</li>
                  <li><strong>연락처:</strong> privacy@savingmind.com</li>
                  <li><strong>전화:</strong> 02-1234-5679</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>문의사항</CardTitle>
            <CardDescription>
              개인정보처리방침에 대한 문의사항이 있으시면 아래로 연락해 주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>회사명:</strong> 절약가 정신</p>
              <p><strong>이메일:</strong> privacy@savingmind.com</p>
              <p><strong>전화:</strong> 02-1234-5679</p>
              <p><strong>주소:</strong> 서울특별시 강남구 테헤란로 123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
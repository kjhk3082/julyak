'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="w-8 h-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">이용약관</h1>
              <p className="text-gray-600">최종 수정일: 2024년 10월 1일</p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>제1조 (목적)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                이 약관은 절약가 정신(이하 "회사")이 제공하는 절약 관리 및 가격 비교 서비스(이하 "서비스")의 
                이용조건 및 절차, 회사와 이용자의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제2조 (정의)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>"서비스"</strong>란 회사가 제공하는 절약 목표 설정, 미션 관리, 가격 비교 등의 모든 서비스를 의미합니다.</li>
                <li><strong>"이용자"</strong>란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.</li>
                <li><strong>"회원"</strong>이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를 지속적으로 이용할 수 있는 자를 의미합니다.</li>
                <li><strong>"비회원"</strong>이란 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 의미합니다.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제3조 (약관의 공지 및 효력과 변경)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ol className="list-decimal pl-6 space-y-3">
                <li>이 약관은 회사가 제공하는 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력을 발생합니다.</li>
                <li>회사는 약관의 규제에 관한 법률, 정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 "정보통신망법") 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
                <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제4조 (서비스의 제공)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>회사는 다음과 같은 서비스를 제공합니다:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>절약 목표 설정 및 관리 서비스</li>
                <li>개인 맞춤형 절약 미션 제공</li>
                <li>전국 실시간 가격 비교 서비스</li>
                <li>AI 기반 절약 코칭 서비스</li>
                <li>절약 현황 및 통계 제공</li>
                <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제5조 (서비스의 중단)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ol className="list-decimal pl-6 space-y-3">
                <li>회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
                <li>회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상하지 않습니다.</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제6조 (회원가입)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ol className="list-decimal pl-6 space-y-3">
                <li>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</li>
                <li>회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제7조 (개인정보보호)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                회사는 이용자의 개인정보를 보호하기 위해 최선을 다하며, 개인정보보호정책에 따라 
                개인정보를 처리합니다. 자세한 내용은 개인정보처리방침을 참고하시기 바랍니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제8조 (면책조항)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ol className="list-decimal pl-6 space-y-3">
                <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
                <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
                <li>회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>문의사항</CardTitle>
            <CardDescription>
              이용약관에 대한 문의사항이 있으시면 아래로 연락해 주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>회사명:</strong> 절약가 정신</p>
              <p><strong>이메일:</strong> support@savingmind.com</p>
              <p><strong>전화:</strong> 02-1234-5678</p>
              <p><strong>주소:</strong> 서울특별시 강남구 테헤란로 123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Bell, Shield, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, deleteAccount } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const [profile, setProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    age: '28',
    income: '300',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    missionReminder: true,
  });

  const handleProfileSave = () => {
    // Here would be the save logic
    console.log('Profile saved:', profile);
  };

  const handleNotificationsSave = () => {
    // Here would be the save logic
    console.log('Notifications saved:', notifications);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 회원탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.')) {
      return;
    }

    if (!window.confirm('마지막 확인입니다. 모든 목표, 절약 계획, 미션이 영구적으로 삭제됩니다. 계속하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const { error } = await deleteAccount();
      if (error) {
        toast({
          title: '회원탈퇴 실패',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: '회원탈퇴 완료',
          description: '그동안 이용해주셔서 감사했습니다.',
        });
        router.push('/');
      }
    } catch (error) {
      toast({
        title: '회원탈퇴 실패',
        description: '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-h2 font-bold text-gray-900 mb-2">설정</h1>
          <p className="text-gray-600">계정 및 앱 설정을 관리하세요</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-6 h-6 mr-2 text-primary" />
              프로필 설정
            </CardTitle>
            <CardDescription>
              개인 정보를 업데이트하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">나이</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="income">월 소득 (만원)</Label>
                <Input
                  id="income"
                  type="number"
                  value={profile.income}
                  onChange={(e) => setProfile(prev => ({ ...prev, income: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleProfileSave}>프로필 저장</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-6 h-6 mr-2 text-primary" />
              알림 설정
            </CardTitle>
            <CardDescription>
              원하는 알림을 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">이메일 알림</h4>
                  <p className="text-sm text-gray-600">중요한 업데이트를 이메일로 받아보세요</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={(e) => setNotifications(prev => ({ 
                    ...prev, 
                    emailNotifications: e.target.checked 
                  }))}
                  className="w-4 h-4"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">푸시 알림</h4>
                  <p className="text-sm text-gray-600">앱에서 실시간 알림을 받아보세요</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.pushNotifications}
                  onChange={(e) => setNotifications(prev => ({ 
                    ...prev, 
                    pushNotifications: e.target.checked 
                  }))}
                  className="w-4 h-4"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">주간 리포트</h4>
                  <p className="text-sm text-gray-600">매주 절약 현황 리포트를 받아보세요</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weeklyReport}
                  onChange={(e) => setNotifications(prev => ({ 
                    ...prev, 
                    weeklyReport: e.target.checked 
                  }))}
                  className="w-4 h-4"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">미션 리마인더</h4>
                  <p className="text-sm text-gray-600">절약 미션 알림을 받아보세요</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.missionReminder}
                  onChange={(e) => setNotifications(prev => ({ 
                    ...prev, 
                    missionReminder: e.target.checked 
                  }))}
                  className="w-4 h-4"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleNotificationsSave}>알림 설정 저장</Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-6 h-6 mr-2 text-primary" />
              개인정보 및 보안
            </CardTitle>
            <CardDescription>
              계정 보안 및 개인정보 설정
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">비밀번호 변경</h4>
                <p className="text-sm text-gray-600">정기적으로 비밀번호를 변경하세요</p>
              </div>
              <Button variant="outline">변경하기</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">2단계 인증</h4>
                <p className="text-sm text-gray-600">계정 보안을 강화하세요</p>
              </div>
              <Button variant="outline">설정하기</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">데이터 다운로드</h4>
                <p className="text-sm text-gray-600">내 데이터를 다운로드하세요</p>
              </div>
              <Button variant="outline">다운로드</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Trash2 className="w-6 h-6 mr-2" />
              위험 구역
            </CardTitle>
            <CardDescription>
              계정 삭제와 같은 위험한 작업들입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-600">계정 삭제</h4>
                <p className="text-sm text-gray-600">
                  계정과 모든 데이터가 영구적으로 삭제됩니다
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2 animate-pulse" />
                    삭제 중...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    계정 삭제
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
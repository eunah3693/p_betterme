import React, { useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import Input from '@/components/Forms/Input';
import Button from '@/components/Buttons/Button';
import { login } from '@/functions/apis/member';

const LoginPage = () => {
  const router = useRouter();

  // 폼 상태
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로그인 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!id.trim()) {
      alert('아이디를 입력해주세요!');
      return;
    }

    if (!password.trim()) {
      alert('비밀번호를 입력해주세요!');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({ id, password });

      if (result.success) {
        alert(`${result.data?.nickname}님, 환영합니다!`);
        // TODO: 로그인 성공 시 세션/쿠키 저장 로직 추가
        // localStorage에 임시로 저장 (실제로는 더 안전한 방법 사용 필요)
        if (result.data) {
          localStorage.setItem('user', JSON.stringify(result.data));
        }
        router.push('/');
      } else {
        alert(result.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enter 키로 로그인
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex justify-center items-center py-16 px-4">
        <div className="w-full max-w-[450px]">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold text-main mb-8 text-center">로그인</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 아이디 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아이디
                </label>
                <Input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="아이디를 입력하세요"
                  className="w-full"
                />
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full"
                />
              </div>

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                color="bgMain"
                size="lg"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? '로그인 중...' : '로그인'}
              </Button>
            </form>

            {/* 회원가입 링크 */}
            <div className="mt-6 text-center text-sm text-gray-600">
              계정이 없으신가요?{' '}
              <button
                onClick={() => router.push('/signup')}
                className="text-main font-medium hover:underline"
              >
                회원가입하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


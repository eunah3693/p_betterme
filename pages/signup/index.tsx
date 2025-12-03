import React, { useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import Input from '@/components/Forms/Input';
import Textarea from '@/components/Forms/Textarea';
import Button from '@/components/Buttons/Button';
import Badge from '@/components/Forms/Badge';
import { checkId, signup } from '@/functions/apis/member';

const SignupPage = () => {
  const router = useRouter();

  // 폼 상태
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [job, setJob] = useState('');
  const [jobInfo, setJobInfo] = useState('');
  
  // 배지 관련 상태
  const [badgeInput, setBadgeInput] = useState('');
  const [badges, setBadges] = useState<string[]>([]);

  // ID 중복 체크 상태
  const [idChecked, setIdChecked] = useState(false);
  const [idAvailable, setIdAvailable] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState('');

  // 로딩 상태
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ID 입력 시 중복체크 초기화
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    setIdChecked(false);
    setIdAvailable(false);
    setIdCheckMessage('');
  };

  // ID 중복 체크
  const handleCheckId = async () => {
    if (!id.trim()) {
      alert('아이디를 입력해주세요!');
      return;
    }

    setIsCheckingId(true);
    try {
      const result = await checkId(id);
      setIdChecked(true);
      setIdAvailable(result.available);
      setIdCheckMessage(result.message || '');
    } catch (error) {
      console.error('ID 중복 체크 실패:', error);
      alert('ID 중복 체크에 실패했습니다.');
    } finally {
      setIsCheckingId(false);
    }
  };

  // 배지 추가
  const handleAddBadge = () => {
    if (!badgeInput.trim()) {
      alert('배지 내용을 입력해주세요!');
      return;
    }

    if (badges.includes(badgeInput.trim())) {
      alert('이미 추가된 배지입니다!');
      return;
    }

    setBadges([...badges, badgeInput.trim()]);
    setBadgeInput('');
  };

  // 배지 삭제
  const handleRemoveBadge = (badgeToRemove: string) => {
    setBadges(badges.filter(badge => badge !== badgeToRemove));
  };

  // Enter 키로 배지 추가
  const handleBadgeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddBadge();
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!id.trim()) {
      alert('아이디를 입력해주세요!');
      return;
    }

    if (!idChecked || !idAvailable) {
      alert('아이디 중복 체크를 완료해주세요!');
      return;
    }

    if (!password.trim()) {
      alert('비밀번호를 입력해주세요!');
      return;
    }

    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요!');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signup({
        id,
        password,
        nickname,
        job: job || '',
        jobInfo: jobInfo || '',
        myBadge: badges.join(','), // 배지를 쉼표로 구분
      });

      if (result.success) {
        alert('회원가입이 완료되었습니다!');
        router.push('/login');
      } else {
        alert(result.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[600px]">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold text-main mb-8 text-center">회원가입</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 아이디 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아이디 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    value={id}
                    onChange={handleIdChange}
                    placeholder="아이디를 입력하세요"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleCheckId}
                    color={idChecked && idAvailable ? 'bgInfo' : 'bgMain'}
                    size="md"
                    className="whitespace-nowrap"
                    disabled={isCheckingId}
                  >
                    {isCheckingId ? '확인 중...' : '중복확인'}
                  </Button>
                </div>
                {idCheckMessage && (
                  <p className={`mt-2 text-sm ${idAvailable ? 'text-green-600' : 'text-red-500'}`}>
                    {idCheckMessage}
                  </p>
                )}
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full"
                />
              </div>

              {/* 닉네임 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  className="w-full"
                />
              </div>

              {/* 직업 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  직업
                </label>
                <Input
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  placeholder="직업을 입력하세요"
                  className="w-full"
                />
              </div>

              {/* 직업 소개 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  직업 소개
                </label>
                <Textarea
                  value={jobInfo}
                  onChange={(e) => setJobInfo(e.target.value)}
                  placeholder="직업에 대해 소개해주세요"
                  rows={4}
                  className="w-full"
                />
              </div>

              {/* 내 소개 배지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내 소개 (배지)
                </label>
                
                {/* 배지 추가 입력 */}
                <div className="flex gap-2 mb-4">
                  <Input
                    value={badgeInput}
                    onChange={(e) => setBadgeInput(e.target.value)}
                    onKeyDown={handleBadgeKeyDown}
                    placeholder="예: 성실한, 노력, 긍정"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddBadge}
                    color="bgMain"
                    size="md"
                    className="whitespace-nowrap"
                  >
                    추가
                  </Button>
                </div>

                {/* 배지 리스트 */}
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                    {badges.map((badge, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Badge color="bMain" size="md">
                          {badge}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => handleRemoveBadge(badge)}
                          className="ml-1 text-gray-500 hover:text-red-500 transition-colors"
                          title="삭제"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 제출 버튼 */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  color="bgMain"
                  size="lg"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '등록 중...' : '회원가입'}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push('/login')}
                  color="bgGray"
                  size="lg"
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </form>

            {/* 로그인 링크 */}
            <div className="mt-6 text-center text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-main font-medium hover:underline"
              >
                로그인하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;


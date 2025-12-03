import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import Input from '@/components/Forms/Input';
import Textarea from '@/components/Forms/Textarea';
import Button from '@/components/Buttons/Button';
import Badge from '@/components/Forms/Badge';
import { getMemberInfo, updateMemberInfo } from '@/functions/apis/member';
import { MemberItem } from '@/interfaces/member';

const MyInfoPage = () => {
  const router = useRouter();

  // 사용자 정보 상태
  const [userIdx, setUserIdx] = useState<number | null>(null);
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  
  // 수정 가능한 필드
  const [job, setJob] = useState('');
  const [jobInfo, setJobInfo] = useState('');
  
  // 배지 관련 상태
  const [badgeInput, setBadgeInput] = useState('');
  const [badges, setBadges] = useState<string[]>([]);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // localStorage에서 사용자 정보 가져오기
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          alert('로그인이 필요합니다!');
          router.push('/login');
          return;
        }

        const user: MemberItem = JSON.parse(userStr);
        setUserIdx(user.idx);

        // API에서 최신 정보 조회
        const result = await getMemberInfo(user.idx);
        
        if (result.success && result.data) {
          setUserId(result.data.id);
          setNickname(result.data.nickname);
          setJob(result.data.job || '');
          setJobInfo(result.data.jobInfo || '');
          
          // 배지 파싱 (쉼표로 구분된 문자열을 배열로)
          if (result.data.myBadge) {
            const badgeArray = result.data.myBadge
              .split(',')
              .map(b => b.trim())
              .filter(b => b.length > 0);
            setBadges(badgeArray);
          }
        } else {
          alert('회원 정보를 불러올 수 없습니다.');
          router.push('/');
        }
      } catch (error) {
        console.error('회원 정보 로드 실패:', error);
        alert('회원 정보를 불러오는데 실패했습니다.');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [router]);

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

  // 회원 정보 수정 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userIdx) {
      alert('사용자 정보를 확인할 수 없습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateMemberInfo({
        idx: userIdx,
        job: job || '',
        jobInfo: jobInfo || '',
        myBadge: badges.join(','), // 배지를 쉼표로 구분
      });

      if (result.success) {
        alert('회원 정보가 수정되었습니다!');
        
        // localStorage 업데이트
        if (result.data) {
          localStorage.setItem('user', JSON.stringify(result.data));
        }
        
        router.push('/');
      } else {
        alert(result.message || '회원 정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      alert('회원 정보 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="font-notoSans min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto mb-4"></div>
            <p className="text-gray-600">회원 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[600px]">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold text-main mb-8 text-center">내 정보 수정</h1>

            {/* 수정 불가능한 정보 표시 */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg space-y-3">
              <div>
                <span className="text-sm text-gray-600">아이디: </span>
                <span className="font-medium text-gray-800">{userId}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">닉네임: </span>
                <span className="font-medium text-gray-800">{nickname}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * 아이디와 닉네임은 수정할 수 없습니다.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                {badges.length > 0 ? (
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
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-400 text-sm">
                    등록된 배지가 없습니다. 위에서 배지를 추가해보세요!
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
                  {isSubmitting ? '수정 중...' : '수정하기'}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push('/')}
                  color="bgGray"
                  size="lg"
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfoPage;


import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import NavBar from '@/components/NavBar';
import Input from '@/components/Forms/Input';
import Textarea from '@/components/Forms/Textarea';
import Button from '@/components/Buttons/Button';
import Badge from '@/components/Forms/Badge';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { getMemberInfo, updateMemberInfo } from '@/functions/apis/member';
import { useBadge } from '@/functions/hooks/member/useBadge';
import { isAuthenticated, setUser } from '@/lib/storage';
import { updateMemberSchema } from '@/lib/validation';

type UpdateMemberFormData = z.infer<typeof updateMemberSchema>;

const MyInfoPage = () => {
  const router = useRouter();

  const [userIdx, setUserIdx] = useState<number | null>(null);
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateMemberFormData>({
    resolver: zodResolver(updateMemberSchema),
    defaultValues: {
      job: '',
      jobInfo: '',
    },
  });

  // 배지 hook
  const {
    badgeInput,
    setBadgeInput,
    badges,
    setBadges,
    handleAddBadge,
    handleRemoveBadge,
    handleBadgeKeyDown,
    getBadgeString,
  } = useBadge();

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 모달 상태
  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
    type: 'info' as 'info' | 'success' | 'error' | 'warning',
    onConfirm: () => {},
  });

  const showModal = useCallback((
    message: string,
    type: 'info' | 'success' | 'error' | 'warning' = 'info',
    onConfirm?: () => void
  ) => {
    setModal({
      isOpen: true,
      message,
      type,
      onConfirm: onConfirm || (() => {}),
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // 배지 문자열을 배열로 변환
  const parseBadges = useCallback((badgeString: string): string[] => {
    return badgeString
      .split(',')
      .map(b => b.trim())
      .filter(b => b.length > 0);
  }, []);

  // 사용자 정보 조회
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const user = isAuthenticated();
        setUserIdx(user?.idx || 0);

        const result = await getMemberInfo(user?.idx || 0);
        
        if (result.success && result.data) {
          setUserId(result.data.id);
          setNickname(result.data.nickname);
          
          reset({
            job: result.data.job || '',
            jobInfo: result.data.jobInfo || '',
          });
          
          if (result.data.myBadge) {
            const badgeArray = parseBadges(result.data.myBadge);
            setBadges(badgeArray);
          }
        } else {
          showModal('회원 정보를 불러올 수 없습니다.', 'error', () => {
            router.push('/');
          });
        }
      } catch (error) {
        console.error('회원 정보 로드 실패:', error);
        showModal('회원 정보를 불러오는데 실패했습니다.', 'error', () => {
          router.push('/');
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [router, reset, setBadges, parseBadges, showModal]);

  // 회원 정보 수정 제출
  const onSubmit = async (data: UpdateMemberFormData) => {
    if (!userIdx) {
      showModal('사용자 정보를 확인할 수 없습니다.', 'error');
      return;
    }

    try {
      const result = await updateMemberInfo({
        idx: userIdx,
        job: data.job || '',
        jobInfo: data.jobInfo || '',
        myBadge: getBadgeString(),
      });

      if (result.success) {
        if (result.data) {
          setUser(result.data);
        }
        
        showModal('회원 정보가 수정되었습니다', 'success');
      } else {
        showModal(result.message || '회원 정보 수정에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      showModal('회원 정보 수정에 실패했습니다.', 'error');
    }
  };

  return (
    <>
      <LoadingOverlay 
        isLoading={isLoading || isSubmitting} 
        message={isLoading ? '회원 정보를 불러오는 중' : isSubmitting ? '회원 정보 수정 중' : ''}
      />
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        message={modal.message}
        type={modal.type}
      />
      <div className="font-notoSans min-h-screen bg-gray-50">
        <NavBar />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[600px]">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold text-main mb-8">내 정보 수정</h1>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  아이디 <span className="ml-2 text-gray-500 font-normal">* 수정할 수 없습니다.</span>
                </label>
                <Input
                  color="bgray"
                  size="md"
                  value={userId}
                  disabled={true}
                  className="w-full"
                />
              </div>
              <div className="pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  닉네임 <span className="ml-2 text-gray-500 font-normal">* 수정할 수 없습니다.</span>
                </label>
                <Input
                  color="bgray"
                  size="md"
                  value={nickname}
                  disabled={true}
                  className="w-full"
                />
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                {/* 직업 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    직업
                  </label>
                  <Input
                    color="bgray"
                    size="md"
                    placeholder="직업을 입력하세요"
                    className="w-full"
                    {...register('job')}
                  />
                  {errors.job && (
                    <p className="text-red-500 text-sm mt-1">{errors.job.message}</p>
                  )}
                </div>

                {/* 직업 소개 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    직업 소개
                  </label>
                  <Textarea
                    color="bgray"
                    size="md"
                    placeholder="직업에 대해 소개해주세요"
                    rows={4}
                    className="w-full"
                    {...register('jobInfo')}
                  />
                  {errors.jobInfo && (
                    <p className="text-red-500 text-sm mt-1">{errors.jobInfo.message}</p>
                  )}
                </div>

                {/* 내 소개 배지 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    내 소개 (배지)
                  </label>
                  
                  {/* 배지 추가 입력 */}
                  <div className="flex gap-2 mb-4 items-center">
                    <div className="flex-2 w-full">
                      <Input
                        color="bgray"
                        size="md"
                        value={badgeInput}
                        onChange={(e) => setBadgeInput(e.target.value)}
                        onKeyDown={handleBadgeKeyDown}
                        placeholder="예: 성실한, 노력, 긍정"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex-1 text-md">
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
                  
                  </div>

                  {/* 배지 리스트 */}
                  {badges.length > 0 ? (
                    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                      {badges.map((badge, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Badge color="bMain" size="sm">
                            {badge}
                            <span  onClick={() => handleRemoveBadge(badge)}
                            className="ml-3 text-white cursor-pointer"
                            title="삭제">✕</span>
                          </Badge>
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
                    수정하기
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
    </>
  );
};

export default MyInfoPage;


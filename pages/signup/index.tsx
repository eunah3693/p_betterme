import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import NavBar from '@/components/NavBar';
import Input from '@/components/Forms/Input';
import Textarea from '@/components/Forms/Textarea';
import Button from '@/components/Buttons/Button';
import Badge from '@/components/Forms/Badge';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { useCheckId } from '@/functions/hooks/member/useCheckId';
import { useBadge } from '@/functions/hooks/member/useBadge';
import { signup } from '@/functions/apis/member';
import { signupSchema } from '@/lib/validation';

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const currentId = watch('id');

  const {
    checked: idChecked,
    available: idAvailable,
    message: idCheckMessage,
    loading: isCheckingId,
    handleCheck: handleCheckId,
  } = useCheckId(currentId || '');

  const {
    badgeInput,
    setBadgeInput,
    badges,
    handleAddBadge,
    handleRemoveBadge,
    handleBadgeKeyDown,
    getBadgeString,
  } = useBadge();

  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
    type: 'info' as 'info' | 'success' | 'error' | 'warning',
    onConfirm: () => {},
  });

  const showModal = (
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
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  // 회원가입 제출
  const onSubmit = async (data: SignupFormData) => {
    // ID 중복 체크 확인
    if (!idChecked) {
      showModal('아이디 중복 체크를 해주세요!', 'warning');
      return;
    }
    // ID 사용가능여부
    if (!idAvailable) {
      showModal('사용할 수 없는 아이디입니다!', 'error');
      return;
    }

    try {
      const result = await signup({
        id: data.id,
        password: data.password,
        nickname: data.nickname,
        job: data.job || '',
        jobInfo: data.jobInfo || '',
        myBadge: getBadgeString(), 
      });

      if (result.success) {
        showModal(
          '회원가입이 완료되었습니다!',
          'success',
          () => router.push('/login')
        );
      } else {
        showModal(result.message || '회원가입에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      showModal('회원가입에 실패했습니다.', 'error');
    }
  };

  return (
    <>
      <LoadingOverlay 
        isLoading={isCheckingId || isSubmitting} 
        message={isCheckingId ? 'ID 중복 확인 중' : '회원가입 처리 중'}
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
            <h1 className="text-3xl font-bold text-main mb-8">회원가입</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-5">
              {/* 아이디 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  아이디 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 items-center">
                  <div className="flex-2 w-full">
                    <Input
                      color="bgray"
                      size="md"
                      {...register('id')}
                      placeholder="아이디를 입력하세요 (영문, 숫자, 밑줄 4-20자)"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Button
                      type="button"
                      onClick={handleCheckId}
                      color={idChecked && idAvailable ? 'bgInfo' : 'bgMain'}
                      size="md"
                      className="whitespace-nowrap"
                      disabled={isCheckingId}
                    >
                      중복확인
                    </Button>
                  </div>
                </div>
                {errors.id && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.id.message}
                  </p>
                )}
                {idCheckMessage && !errors.id && (
                  <p className={`mt-2 text-sm ${idAvailable ? 'text-main' : 'text-red-500'}`}>
                    {idCheckMessage}
                  </p>
                )}
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <Input
                  color="bgray"
                  size="md"
                  type="password"
                  {...register('password')}
                  placeholder="비밀번호를 입력하세요 (6-20자)"
                  className="w-full"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* 닉네임 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  닉네임 <span className="text-red-500">*</span>
                </label>
                <Input
                  color="bgray"
                  size="md"
                  {...register('nickname')}
                  placeholder="닉네임을 입력하세요 (2-10자)"
                  className="w-full"
                />
                {errors.nickname && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.nickname.message}
                  </p>
                )}
              </div>

              {/* 직업 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  직업
                </label>
                <Input
                  color="bgray"
                  size="md"
                  {...register('job')}
                  placeholder="직업을 입력하세요"
                  className="w-full"
                />
              </div>

              {/* 직업 소개 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  직업 소개
                </label>
                <Textarea
                  color="bgray"
                  size="md"
                  {...register('jobInfo')}
                  placeholder="직업에 대해 소개해주세요"
                  rows={4}
                  className="w-full"
                />
              </div>

              {/* 내 소개 배지 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  내 배지
                </label>
                
                {/* 배지 추가 입력 */}
                <div className="flex gap-2 items-center">
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
                  <div className="flex-1">
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
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                    {badges.map((badge, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Badge color="bMain" size="sm">
                          {badge}
                          <span  onClick={() => handleRemoveBadge(badge)}
                          className="ml-3 text-white hover:text-red-500 transition-colors"
                          title="삭제">✕</span>
                        </Badge>
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
                  회원가입
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
                className="text-main font-bold hover:underline"
              >
                로그인하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignupPage;


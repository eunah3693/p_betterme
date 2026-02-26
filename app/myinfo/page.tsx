'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/Forms/Input';
import Textarea from '@/components/Forms/Textarea';
import Button from '@/components/Buttons/Button';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import MyBadge from '@/components/Badge/MyBadge';
import { updateMemberInfo } from '@/functions/apis/member';
import { useModal } from '@/functions/hooks/useModal';
import { getMemberInfo } from '@/functions/apis/member';
import { useUserStore } from '@/store/user';

// 회원 정보 수정 스키마 
const updateMemberFormSchema = z.object({
  job: z.string()
    .min(1, '직업을 입력해주세요')
    .max(50, '직업은 최대 50자까지 가능합니다'),
  jobInfo: z.string()
    .max(500, '직업 소개는 최대 500자까지 가능합니다')
    .optional(),
  myBadge: z.string().optional(),
});

type UpdateMemberFormData = z.infer<typeof updateMemberFormSchema>;

export default function MyInfoPage() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const { modal, showModal, closeModal } = useModal();

  // 서버에서 회원 정보 조회
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["myInfo", user?.idx],
    queryFn: () => getMemberInfo({idx: user?.idx || 0}),
    enabled: !!user?.idx,
  });

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<UpdateMemberFormData>({
    resolver: zodResolver(updateMemberFormSchema),
    defaultValues: {
      job: '',
      jobInfo: '',
      myBadge: '',
    },
  });

  // userInfo가 로드되면 폼 초기화
  useEffect(() => {
    if (userInfo?.data) {
      reset({
        job: userInfo.data.job || '',
        jobInfo: userInfo.data.jobInfo || '',
        myBadge: userInfo.data.myBadge || '',
      });
    }
  }, [userInfo, reset]);



  // 회원 정보 수정 제출
  const onSubmit = async (data: UpdateMemberFormData) => {
    try {
      const result = await updateMemberInfo({
        idx: userInfo?.data?.idx || 0,
        job: data.job || '',
        jobInfo: data.jobInfo || '',
        myBadge: data.myBadge || '',
      });

      if (result.success) {
        if (result.data) {
          useUserStore.setState({ user: result.data });
        }
        
        showModal('회원 정보가 수정되었습니다', 'success', () => {
          router.push('/');
        });
      } else {
        showModal(result.message || '회원 정보 수정에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      showModal('회원 정보 수정에 실패했습니다.', 'error');
    }
  };

  // 로딩 중이면 로딩 표시
  if (isLoading || !userInfo?.data) {
    return <LoadingOverlay isLoading={true} message="회원 정보 불러오는 중" />;
  }

  const userId = userInfo.data.id || '';
  const nickname = userInfo.data.nickname || '';

  return (
    <>
      <LoadingOverlay 
        isLoading={isSubmitting} 
        message="회원 정보 수정 중"
      />
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        message={modal.message}
        type={modal.type}
      />
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
                {/* 전체 폼 에러 메시지 */}
                {errors.root && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{errors.root.message}</p>
                  </div>
                )}

                {/* 직업 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    직업 <span className="text-red-500">*</span>
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
                  
                  <MyBadge 
                    setValue={setValue}
                    watch={watch}
                    fieldName="myBadge"
                    onError={(message) => showModal(message, 'error')}
                  />
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
    </>
  );
}

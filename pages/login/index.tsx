'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import NavBar from '@/components/NavBar';
import Input from '@/components/Forms/Input';
import Button from '@/components/Buttons/Button';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import { login } from '@/functions/apis/member';
import { loginSchema } from '@/lib/validation';
import { useUserStore } from '@/store/user';
import { useModal } from '@/functions/hooks/useModal';

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);  // user store 
  const { modal, showModal, closeModal } = useModal(); // modal hook

  //login form 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      id: '',
      password: '',
    },
  });

  // login 제출
  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login({ id: data.id, password: data.password });

      // login success = true
      if (result.success && result.data) {
        setUser(result.data);
        showModal(
          `${result.data.nickname}님, 환영합니다`,
          'success',
          () => router.push('/')
        );
      } else {
        // login success = false
        showModal(result.message || '로그인에 실패했습니다.', 'error');
      }
    } catch (error) {
      // axios error
      console.error('로그인 실패:', error);
      showModal('로그인에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={isSubmitting} message="로그인 중" />
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        message={modal.message}
        type={modal.type}
      />
      <NavBar />
      <div className="flex justify-center items-center py-16 px-4">
        <div className="w-full max-w-[450px]">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold text-main mb-8">로그인</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  아이디
                </label>
                <Input
                  color="bgray"
                  size="md"
                  placeholder="아이디를 입력하세요"
                  className="w-full"
                  {...register('id')}
                />
                {errors.id && (
                  <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  비밀번호
                </label>
                <Input
                  color="bgray"
                  size="md"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="w-full"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              <Button
                type="submit"
                color="bgMain"
                size="md"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                로그인
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              계정이 없으신가요?
              <button
                onClick={() => router.push('/signup')}
                className="text-main font-bold hover:underline ml-1"
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


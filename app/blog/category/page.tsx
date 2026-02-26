'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/store/user';
import { useModal } from '@/functions/hooks/useModal';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/functions/apis/blog';
import { BlogCategoryItem, BlogCategoryResponse } from '@/interfaces/blog';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { cn } from '@/constants/cn';
import CategoryAddForm from '@/components/Blog/CategoryAddForm';
import CategoryEditForm from '@/components/Blog/CategoryEditForm';
import CategoryListItem from '@/components/Blog/CategoryListItem';

export default function BlogCategoryPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { modal, showModal, closeModal } = useModal();

  // State 관리
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryOrder, setNewCategoryOrder] = useState('0');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editOrder, setEditOrder] = useState('');

  // 로그인 체크
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // 카테고리 목록 조회 
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: () => getCategories(user?.id || ''),
    enabled: !!user?.id, 
  });

  const categories: BlogCategoryItem[] = categoriesData?.data || [];

  // 카테고리 추가 
  const addCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (data: BlogCategoryResponse) => {
      if (data.success) {
        showModal('카테고리가 추가되었습니다.', 'success', () => {
          setNewCategoryName('');
          setNewCategoryOrder('0');
          queryClient.invalidateQueries({ queryKey: ['categories', user?.id] }); // 카테고리 목록 새로고침
        });
      } else {
        showModal(data.message || '카테고리 추가에 실패했습니다.', 'error');
      }
    },
    onError: (error: unknown) => {
      console.error('카테고리 추가 실패:', error);
      showModal('카테고리 추가 중 오류가 발생했습니다.', 'error');
    }
  });

  // 카테고리 수정 Mutation
  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: (data: BlogCategoryResponse) => {
      if (data.success) {
        showModal('카테고리가 수정되었습니다.', 'success', () => {
          cancelEdit();
          queryClient.invalidateQueries({ queryKey: ['categories', user?.id] }); // 카테고리 목록 새로고침
        });
      } else {
        showModal(data.message || '카테고리 수정에 실패했습니다.', 'error');
      }
    },
    onError: (error: unknown) => {
      console.error('카테고리 수정 실패:', error);
      showModal('카테고리 수정 중 오류가 발생했습니다.', 'error');
    }
  });

  // 카테고리 삭제 Mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data: BlogCategoryResponse) => {
      if (data.success) {
        showModal('카테고리가 삭제되었습니다.', 'success', () => {
          queryClient.invalidateQueries({ queryKey: ['categories', user?.id] }); // 카테고리 목록 새로고침
        });
      } else {
        showModal(data.message || '카테고리 삭제에 실패했습니다.', 'error');
      }
    },
    onError: (error: unknown) => {
      console.error('카테고리 삭제 실패:', error);
      showModal('카테고리 삭제 중 오류가 발생했습니다.', 'error');
    }
  });

  // 카테고리 추가 핸들러
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      showModal('카테고리 이름을 입력해주세요.', 'error');
      return;
    }

    addCategoryMutation.mutate({
      memberId: user?.id || '',
      categoryName: newCategoryName,
      order: parseInt(newCategoryOrder) || 0
    });
  };

  // 수정 모드 시작
  const startEdit = (category: BlogCategoryItem) => {
    setEditingIdx(category.idx);
    setEditName(category.categoryName || '');
    setEditOrder(String(category.order || 0));
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingIdx(null);
    setEditName('');
    setEditOrder('');
  };

  // 카테고리 수정 핸들러
  const handleUpdateCategory = (idx: number) => {
    if (!editName.trim()) {
      showModal('카테고리 이름을 입력해주세요.', 'error');
      return;
    }

    updateCategoryMutation.mutate({
      idx,
      categoryName: editName,
      order: parseInt(editOrder) || 0
    });
  };

  // 카테고리 삭제 핸들러
  const handleDeleteCategory = (idx: number) => {
    deleteCategoryMutation.mutate(idx);
  };

  const loading = isLoading || addCategoryMutation.isPending || 
                  updateCategoryMutation.isPending || deleteCategoryMutation.isPending;

  return (
    <>
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%] bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-main mb-2">블로그 카테고리 관리</h2>
            <p className="text-sm text-gray-600">
              블로그 글을 분류할 카테고리를 추가, 수정, 삭제할 수 있습니다.
            </p>
          </div>
          
          <div className="space-y-6">
            {/* 카테고리 추가 섹션 */}
            <CategoryAddForm
              categoryName={newCategoryName}
              onCategoryNameChange={setNewCategoryName}
              order={newCategoryOrder}
              onOrderChange={setNewCategoryOrder}
              onAdd={handleAddCategory}
              loading={loading}
            />

            {/* 카테고리 목록 */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">카테고리 목록</h3>
              {categories.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                  아직 등록된 카테고리가 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.idx}
                      className={cn(
                        'p-4 rounded-lg border transition-colors',
                        editingIdx === category.idx
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      )}
                    >
                      {editingIdx === category.idx ? (
                        // 수정 모드
                        <CategoryEditForm
                          categoryIdx={category.idx}
                          editName={editName}
                          onEditNameChange={setEditName}
                          editOrder={editOrder}
                          onEditOrderChange={setEditOrder}
                          onSave={handleUpdateCategory}
                          onCancel={cancelEdit}
                          loading={loading}
                        />
                      ) : (
                        // 일반 모드
                        <CategoryListItem
                          category={category}
                          onEdit={startEdit}
                          onDelete={handleDeleteCategory}
                          loading={loading}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        message={modal.message}
        type={modal.type}
      />
    </>
  );
}

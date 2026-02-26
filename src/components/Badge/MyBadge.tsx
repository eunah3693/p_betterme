'use client';

import Badge from '@/components/Forms/Badge';
import Input from '@/components/Forms/Input';
import Button from '@/components/Buttons/Button';
import { UseFormSetValue, UseFormWatch, FieldValues, Path, PathValue } from 'react-hook-form';
import { useState } from 'react';

interface MyBadgeProps<T extends FieldValues = FieldValues> {
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  fieldName?: Path<T>;
  onError?: (message: string) => void;
}

export default function MyBadge<T extends FieldValues = FieldValues>({ setValue, watch, fieldName = 'myBadge' as Path<T>, onError }: MyBadgeProps<T>) {
  // 배지 입력 input
  const [badgeInput, setBadgeInput] = useState('');

  // 현재 배지 리스트 
  const badges = ((watch(fieldName) as string) || '').split(',').map((b: string) => b.trim()).filter(Boolean);

  // 에러 표시
  const showError = (message: string) => {
    if (onError) {
      onError(message);
    } else {
      alert(message);
    }
  };

  // 배지 추가
  const handleAddBadge = () => {
    const trimmed = badgeInput.trim();
    if (!trimmed) {
      showError('배지 내용을 입력해주세요!');
      return;
    }

    if (badges.includes(trimmed)) {
      showError('이미 추가된 배지입니다!');
      return;
    }

    setValue(fieldName, [...badges, trimmed].join(',') as PathValue<T, Path<T>>, { shouldValidate: true });
    setBadgeInput('');
  };

  // 배지 삭제
  const handleRemoveBadge = (badgeToRemove: string) => {
    const newBadges = badges.filter((badge: string) => badge !== badgeToRemove);
    setValue(fieldName, newBadges.join(',') as PathValue<T, Path<T>>, { shouldValidate: true });
  };

  // Enter 키로 배지 추가
  const handleBadgeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddBadge();
    }
  };

  return (
    <div>
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
          {badges.map((badge: string, index: number) => (
            <div key={index} className="flex items-center gap-1">
              <Badge color="bMain" size="sm">
                {badge}
                <span
                  onClick={() => handleRemoveBadge(badge)}
                  className="ml-3 text-white cursor-pointer"
                  title="삭제"
                >
                  ✕
                </span>
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
  );
}
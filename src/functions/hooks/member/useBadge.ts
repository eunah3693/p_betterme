import { useState } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface UseBadgeProps {
  setValue?: UseFormSetValue<any>;
  watch?: UseFormWatch<any>;
  fieldName?: string;
  onError?: (message: string) => void;
}

export function useBadge(props?: UseBadgeProps) {
  const { setValue, watch, fieldName = 'myBadge', onError } = props || {};
  const [badgeInput, setBadgeInput] = useState('');
  const [internalBadges, setInternalBadges] = useState<string[]>([]);
  
  // React Hook Form 모드인지 체크
  const isFormMode = !!setValue && !!watch;

  // 현재 배지 리스트 (Form 모드면 watch에서, 아니면 내부 state에서)
  const badges = isFormMode 
    ? (watch!(fieldName) || '').split(',').map((b: string) => b.trim()).filter(Boolean)
    : internalBadges;

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

    if (isFormMode) {
      setValue!(fieldName, [...badges, trimmed].join(','), { shouldValidate: true });
    } else {
      setInternalBadges([...badges, trimmed]);
    }
    setBadgeInput('');
  };

  // 배지 삭제
  const handleRemoveBadge = (badgeToRemove: string) => {
    const newBadges = badges.filter((badge: string) => badge !== badgeToRemove);
    if (isFormMode) {
      setValue!(fieldName, newBadges.join(','), { shouldValidate: true });
    } else {
      setInternalBadges(newBadges);
    }
  };

  // Enter 키로 배지 추가
  const handleBadgeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddBadge();
    }
  };

  // 배지를 쉼표로 구분된 문자열로 변환 (내부 state 모드용)
  const getBadgeString = () => {
    return badges.join(',');
  };

  return {
    badgeInput,
    setBadgeInput,
    badges,
    setBadges: setInternalBadges, 
    handleAddBadge,
    handleRemoveBadge,
    handleBadgeKeyDown,
    getBadgeString,
  };
}


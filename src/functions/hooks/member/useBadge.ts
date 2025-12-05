import { useState } from 'react';

export function useBadge() {
  const [badgeInput, setBadgeInput] = useState(''); // 배지 입력 input
  const [badges, setBadges] = useState<string[]>([]); // 배지 리스트

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

  // 배지를 쉼표로 구분된 문자열로 변환
  const getBadgeString = () => {
    return badges.join(',');
  };

  return {
    badgeInput,
    setBadgeInput,
    badges,
    handleAddBadge,
    handleRemoveBadge,
    handleBadgeKeyDown,
    getBadgeString,
  };
}


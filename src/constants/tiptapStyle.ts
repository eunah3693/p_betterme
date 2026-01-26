// TipTap 에디터에서 사용할 텍스트 색상 옵션들
export const TEXT_COLORS = [
  { name: '검정', color: '#000000' },
  { name: '빨강', color: '#dd284f' },
  { name: '분홍', color: '#d161b9' },
  { name: '하늘', color: '#5063d6' },
  { name: '파랑', color: '#182368' },
  { name: '초록', color: '#075128' },
  { name: '보라', color: '#321142' },
  { name: '주황', color: '#ba5f22' },
] as const;

// 색상 타입 정의
export type TextColor = typeof TEXT_COLORS[number];

// TipTap 에디터에서 사용할 배경 색상 옵션들
export const BACKGROUND_COLORS = [
  { name: '검정', color: '#000000' },
  { name: '빨강', color: '#dd284f' },
  { name: '분홍', color: '#d161b9' },
  { name: '하늘', color: '#5063d6' },
  { name: '파랑', color: '#182368' },
  { name: '초록', color: '#075128' },
  { name: '보라', color: '#321142' },
  { name: '주황', color: '#ba5f22' },
] as const;

// 색상 타입 정의
export type BackgroundColor = typeof BACKGROUND_COLORS[number];

// TipTap 에디터에서 사용할 헤딩 레벨 옵션들
export const HEADING_LEVELS = [
  { value: 0, label: '제목' },
  { value: 1, label: '제목 1' },
  { value: 2, label: '제목 2' },
  { value: 3, label: '제목 3' },
  { value: 4, label: '제목 4' },
  { value: 5, label: '제목 5' },
  { value: 6, label: '제목 6' },
] as const;

// 헤딩 타입 정의
export type HeadingLevel = typeof HEADING_LEVELS[number];

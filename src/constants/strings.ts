import { paths } from './paths';

// 공통 메뉴 (로그인 여부와 관계없이 항상 표시)
export const commonNavData = [
  { text: 'CALENDAR', url: paths.CALENDAR},
  { text: 'DIARY', url: paths.DIARY},
  { text: 'BLOG', url: paths.BLOG },
];

// 비로그인 시 표시되는 메뉴
export const guestNavData = [
  { text: 'LOGIN', url: paths.LOGIN },
  { text: 'SIGN UP', url: paths.SIGNUP },
];

// 로그인 시 표시되는 메뉴
export const authNavData = [
  { text: 'MY INFO', url: paths.MYINFO },
  { text: 'LOGOUT', url: paths.LOGOUT },
];


export const footerData = {
  phone: '번호 : 010-9824-2104',
  name: '제작 : 김은아',
};

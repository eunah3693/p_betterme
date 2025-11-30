import { paths } from './paths';

export const navData = [
  { text: 'CALENDAR', url: paths.GALLERY, filter: { artType: 'PERFORMANCE_EXHIBITION', artCode: 'EXHIBITION' } },
  { text: 'DIARY', url: paths.FESTIVAL, filter: { artType: 'EVENT_FESTIVAL', artCode: 'EVENT_FESTIVAL' } },
  { text: 'BLOG', url: paths.EDUCATION, filter: { artType: 'EDUCATION_EXPERIENCE', artCode: 'EDUCATION_EXPERIENCE' } },
  { text: 'PROJECT', url: paths.CALENDAR },
  { text: 'CHAT', url: paths.MAP },
  { text: 'LOGIN', url: paths.MAP },
  { text: 'SIGHN UP', url: paths.MAP },
  { text: 'MY INFO', url: paths.MAP },
];


export const footerData = {
  phone: '번호 : 010-9824-2104',
  name: '제작 : 김은아',
};

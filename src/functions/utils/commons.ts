import { ParsedUrlQuery } from 'querystring';
import { artString } from '@/constants/strings';

export const decodeHtmlEntities = (text: string): string => {
  return text
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&nbsp;/g, ' ');
};

// 랜덤으로 artCode와 artType 선택 
export const getRandomArtTypeAndCode = (): {
  artTypeKey: string;
  artCodeKey: string;
} => {
  // artString에서 대분류(artType) 랜덤 선택
  const artTypes = Object.keys(artString) as (keyof typeof artString)[];
  const randomTypeIndex = Math.floor(Math.random() * artTypes.length);
  const selectedArtType = artTypes[randomTypeIndex];

  // 선택된 대분류에서 소분류(artCode) 랜덤 선택
  const availableCodes = artString[selectedArtType];
  const randomCodeIndex = Math.floor(Math.random() * availableCodes.length);
  const selectedArtCode = availableCodes[randomCodeIndex];

  return {
    artTypeKey: selectedArtType,
    artCodeKey: selectedArtCode
  };
};


export const setArtFilter = ({
  query,
}: {
  query: ParsedUrlQuery;
}) => {
  const getStringValue = (value: string | string[] | undefined): string => {
    if (Array.isArray(value)) {
      return value[0] || '';
    }
    return value || '';
  };

  return {
    ArtCode: getStringValue(query.ArtCode),
    ArtType: getStringValue(query.ArtType),
    location: getStringValue(query.location),
    date: getStringValue(query.date),
  };
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

export const asString = (v: string | string[] | undefined): string | undefined =>
  typeof v === 'string' ? v : Array.isArray(v) ? v[0] : undefined;
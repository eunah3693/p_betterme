import { api } from './fetch';
import {
  DiaryListResponse,
  DiaryResponse,
  CreateDiaryRequest,
  UpdateDiaryRequest,
  CreateDiaryResponse,
  DeleteDiaryResponse,
} from '@/interfaces/diary';

const DIARY_URL = '/api/diary';

export const getNextDiaryPageParam = (lastPage: DiaryListResponse) => {
  if (!lastPage.page) return undefined;

  const { number, totalPages } = lastPage.page;
  return number + 1 < totalPages ? number + 1 : undefined;
};

export const fetchDiaries = async (
  page = 0
): Promise<DiaryListResponse> => {
  try {
    return await api.get<DiaryListResponse>(DIARY_URL, { page });
  } catch (error) {
    console.error('일기 목록 조회 실패:', error);
    throw error;
  }
};

// 특정 일기 조회
export const getDiaryByIdx = async (idx: number): Promise<DiaryResponse> => {
  try {
    return await api.get<DiaryResponse>(`${DIARY_URL}/${idx}`);
  } catch (error) {
    console.error('일기 조회 실패:', error);
    throw error;
  }
};

// 일기 등록
export const createDiary = async (
  diaryData: CreateDiaryRequest
): Promise<CreateDiaryResponse> => {
  try {
    return await api.post<CreateDiaryResponse>(
      DIARY_URL,
      diaryData 
    );
  } catch (error) {
    console.error('일기 등록 실패:', error);
    throw error;
  }
};

// 일기 수정 (PUT /api/diary/:idx)
export const updateDiary = async (
  diaryData: UpdateDiaryRequest
): Promise<DiaryResponse> => {
  try {
    const { idx, ...body } = diaryData;
    return await api.put<DiaryResponse>(
      `${DIARY_URL}/${idx}`,
      body
    );
  } catch (error) {
    console.error('일기 수정 실패:', error);
    throw error;
  }
};

// 일기 삭제 (DELETE /api/diary/:idx)
export const deleteDiary = async (
  idx: number
): Promise<DeleteDiaryResponse> => {
  try {
    return await api.delete<DeleteDiaryResponse>(`${DIARY_URL}/${idx}`);
  } catch (error) {
    console.error('일기 삭제 실패:', error);
    throw error;
  }
};

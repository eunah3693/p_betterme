import { axiosInstance } from './axios';
import { DiaryItem, DiaryListResponse, DiaryResponse, CreateDiaryRequest, UpdateDiaryRequest } from '@/interfaces/diary';

const DIARY_URL = '/api/diary';

// 모든 일기 조회
export const getAllDiaries = async (): Promise<DiaryListResponse> => {
  try {
    const { data } = await axiosInstance.get<DiaryListResponse>(DIARY_URL);
    return data;
  } catch (error) {
    console.error('일기 목록 조회 실패:', error);
    throw error;
  }
};

// 특정 일기 조회
export const getDiaryByIdx = async (idx: number): Promise<DiaryResponse> => {
  try {
    const { data } = await axiosInstance.get<DiaryResponse>(`${DIARY_URL}/${idx}`);
    return data;
  } catch (error) {
    console.error('일기 조회 실패:', error);
    throw error;
  }
};

// 일기 등록
export const createDiary = async (
  diaryData: CreateDiaryRequest
): Promise<{ success: boolean; data: DiaryItem; message?: string }> => {
  try {
    const { data } = await axiosInstance.post<{ success: boolean; data: DiaryItem; message?: string }>(
      `${DIARY_URL}/register`,
      diaryData
    );
    return data;
  } catch (error) {
    console.error('일기 등록 실패:', error);
    throw error;
  }
};

// 일기 수정
export const updateDiary = async (
  diaryData: UpdateDiaryRequest
): Promise<{ success: boolean; data: DiaryItem; message?: string }> => {
  try {
    const { idx, ...body } = diaryData;
    const { data } = await axiosInstance.put<{ success: boolean; data: DiaryItem; message?: string }>(
      `${DIARY_URL}/${idx}/update`,
      body
    );
    return data;
  } catch (error) {
    console.error('일기 수정 실패:', error);
    throw error;
  }
};

// 일기 삭제
export const deleteDiary = async (idx: number) => {
  try {
    const { data } = await axiosInstance.delete(`${DIARY_URL}/${idx}/delete`);
    return data;
  } catch (error) {
    console.error('일기 삭제 실패:', error);
    throw error;
  }
};


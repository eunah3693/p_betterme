import { DiaryRepository } from '@/repositories/diaryRepository';
import { DiaryItem, DiaryListResponse, DiaryResponse, CreateDiaryRequest, UpdateDiaryRequest } from '@/interfaces/diary';

export class DiaryService {
  private diaryRepository: DiaryRepository;
  
  constructor() {
    this.diaryRepository = new DiaryRepository();
  }
  
  // 모든 일기 조회
  async getAllDiaries(): Promise<DiaryListResponse> {
    try {
      const diaries = await this.diaryRepository.getAllDiaries();
      return {
        success: true,
        data: diaries
      };
    } catch (error) {
      console.error('일기 목록 조회 실패:', error);
      return {
        success: false,
        data: []
      };
    }
  }
  
  // 특정 일기 조회
  async getDiaryByIdx(idx: number): Promise<DiaryResponse> {
    try {
      const diary = await this.diaryRepository.getDiaryByIdx(idx);
      if (!diary) {
        return {
          success: false,
          data: [],
          message: '일기를 찾을 수 없습니다.'
        };
      }
      return {
        success: true,
        data: diary
      };
    } catch (error) {
      console.error('일기 조회 실패:', error);
      return {
        success: false,
        data: [],
        message: '일기 조회 중 오류가 발생했습니다.'
      };
    }
  }
  
  // 일기 등록
  async registerDiary(data: CreateDiaryRequest): Promise<DiaryItem> {
    return await this.diaryRepository.createDiary(data);
  }
  
  // 일기 수정
  async updateDiary(idx: number, data: UpdateDiaryRequest): Promise<DiaryItem> {
    return await this.diaryRepository.updateDiary(idx, data);
  }
  
  // 일기 삭제
  async deleteDiary(idx: number): Promise<void> {
    await this.diaryRepository.deleteDiary(idx);
  }
}


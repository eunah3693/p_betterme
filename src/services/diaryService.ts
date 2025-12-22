import { DiaryRepository } from '@/repositories/diaryRepository';
import { DiaryItem, DiaryListResponse, DiaryResponse, CreateDiaryData, UpdateDiaryData } from '@/interfaces/diary';

export class DiaryService {
  private diaryRepository: DiaryRepository;
  
  constructor() {
    this.diaryRepository = new DiaryRepository();
  }
  
  //  일기 조회 
  async getAllDiaries(memberId?: string): Promise<DiaryListResponse> {
    try {
      const diaries = await this.diaryRepository.getAllDiaries(memberId);
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
  
  // 일기 조회
  async getDiaryByIdx(idx: number, memberId: string): Promise<DiaryResponse> {
    try {
      const diary = await this.diaryRepository.getDiaryByIdx(idx, memberId);
      if (!diary) {
        return {
          success: false,
          data: [],
          message: '일기를 찾을 수 없거나 접근 권한이 없습니다.'
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
  async registerDiary(data: CreateDiaryData): Promise<DiaryItem> {
    return await this.diaryRepository.createDiary(data);
  }
  
  // 일기 수정 (소유자 확인 포함)
  async updateDiary(data: UpdateDiaryData): Promise<DiaryResponse> {
    try {
      // 먼저 본인의 일기인지 확인
      const diary = await this.diaryRepository.getDiaryByIdx(data.idx, data.memberId);
      if (!diary) {
        return {
          success: false,
          data: [],
          message: '일기를 찾을 수 없거나 수정 권한이 없습니다.'
        };
      }

      // 수정 진행
      const updated = await this.diaryRepository.updateDiary(data.idx, data);
      return {
        success: true,
        data: updated,
        message: '일기가 수정되었습니다.'
      };
    } catch (error) {
      console.error('일기 수정 실패:', error);
      return {
        success: false,
        data: [],
        message: '일기 수정 중 오류가 발생했습니다.'
      };
    }
  }
  
  // 일기 삭제 (소유자 확인 포함)
  async deleteDiary(idx: number, memberId: string): Promise<DiaryResponse> {
    try {
      // 먼저 본인의 일기인지 확인
      const diary = await this.diaryRepository.getDiaryByIdx(idx, memberId);
      if (!diary) {
        return {
          success: false,
          data: [],
          message: '일기를 찾을 수 없거나 삭제 권한이 없습니다.'
        };
      }

      // 삭제 진행
      await this.diaryRepository.deleteDiary(idx);
      return {
        success: true,
        data: [],
        message: '일기가 삭제되었습니다.'
      };
    } catch (error) {
      console.error('일기 삭제 실패:', error);
      return {
        success: false,
        data: [],
        message: '일기 삭제 중 오류가 발생했습니다.'
      };
    }
  }
}


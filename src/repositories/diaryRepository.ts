import { prisma } from '@/lib/prisma';
import {
  DiaryItem,
  DiaryListRequest,
  DiaryListResponse,
  CreateDiaryData,
  UpdateDiaryData,
} from '@/interfaces/diary';
import { Prisma } from '@prisma/client';

export class DiaryRepository {
  
  // DB 데이터를 DiaryItem으로 변환
  private changeToDiaryItem(dbRow: Prisma.DiaryGetPayload<Record<string, never>>): DiaryItem {
    return {
      idx: dbRow.idx,
      memberId: dbRow.memberId,
      subject: dbRow.subject,
      content: dbRow.content,
      date: dbRow.date ? dbRow.date.toISOString().split('T')[0] : null,
    };
  }

  // 일기 목록 조회
  async getDiaries(memberId: string, params: DiaryListRequest): Promise<DiaryListResponse> {
    const pageSize = 12;
    const skip = params.page * pageSize;
    const whereCondition = { memberId };

    const totalElements = await prisma.diary.count({
      where: whereCondition,
    });

    const diaries = await prisma.diary.findMany({
      where: whereCondition,
      orderBy: [
        {
          date: 'desc',
        },
        {
          idx: 'desc',
        },
      ],
      skip,
      take: pageSize,
    });

    return {
      success: true,
      data: diaries.map(diary => this.changeToDiaryItem(diary)),
      page: {
        number: params.page,
        totalPages: Math.ceil(totalElements / pageSize),
        totalElements: totalElements,
        size: pageSize
      },
    };
  }

  // 일기 조회
  async getDiaryByIdx(idx: number, memberId: string): Promise<DiaryItem | null> {
    const diary = await prisma.diary.findFirst({
      where: { 
        idx,
        memberId 
      }
    });

    if (!diary) {
      return null;
    }

    return this.changeToDiaryItem(diary);
  }

  // 일기 추가
  async createDiary(data: CreateDiaryData): Promise<DiaryItem> {
    const diary = await prisma.diary.create({
      data: {
        memberId: data.memberId,
        subject: data.subject,
        content: data.content,
        date: data.date,
      }
    });

    return this.changeToDiaryItem(diary);
  }

  // 일기 수정
  async updateDiary(idx: number, data: UpdateDiaryData): Promise<DiaryItem> {
    const diary = await prisma.diary.update({
      where: { idx },
      data
    });

    return this.changeToDiaryItem(diary);
  }

  // 일기 삭제
  async deleteDiary(idx: number): Promise<void> {
    await prisma.diary.delete({
      where: { idx }
    });
  }
}

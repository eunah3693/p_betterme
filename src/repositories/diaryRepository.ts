import { prisma } from '@/lib/prisma';
import { DiaryItem } from '@/interfaces/diary';
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

  // 모든 일기 조회
  async getAllDiaries(): Promise<DiaryItem[]> {
    const diaries = await prisma.diary.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    return diaries.map(diary => this.changeToDiaryItem(diary));
  }

  // 특정 일기 조회
  async getDiaryByIdx(idx: number): Promise<DiaryItem | null> {
    const diary = await prisma.diary.findUnique({
      where: { idx }
    });

    if (!diary) {
      return null;
    }

    return this.changeToDiaryItem(diary);
  }

  // 일기 추가
  async createDiary(data: {
    memberId: string;
    subject: string;
    content: string;
    date: Date;
  }): Promise<DiaryItem> {
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
  async updateDiary(idx: number, data: {
    subject?: string;
    content?: string;
    date?: Date;
  }): Promise<DiaryItem> {
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


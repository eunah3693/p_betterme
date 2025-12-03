import { prisma } from '@/lib/prisma';
import { MemberItem } from '@/interfaces/member';
import { Prisma } from '@prisma/client';

export class MemberRepository {
  private changeToMemberItem(dbRow: Prisma.MemberGetPayload<Record<string, never>>): MemberItem {
    return {
      idx: dbRow.idx,
      id: dbRow.id,
      password: dbRow.password,
      nickname: dbRow.nickname,
      job: dbRow.job,
      jobInfo: dbRow.jobInfo,
      myBadge: dbRow.myBadge,
    };
  }

  // ID로 회원 조회
  async getMemberById(id: string): Promise<MemberItem | null> {
    const member = await prisma.member.findFirst({
      where: { id }
    });
    return member ? this.changeToMemberItem(member) : null;
  }

  // idx로 회원 조회
  async getMemberByIdx(idx: number): Promise<MemberItem | null> {
    const member = await prisma.member.findUnique({
      where: { idx }
    });
    return member ? this.changeToMemberItem(member) : null;
  }

  // ID 중복 체크
  async checkIdExists(id: string): Promise<boolean> {
    const count = await prisma.member.count({
      where: { id }
    });
    return count > 0;
  }

  // 회원 생성
  async createMember(data: {
    id: string;
    password: string;
    nickname: string;
    job: string;
    jobInfo: string;
    myBadge: string;
  }): Promise<MemberItem> {
    const member = await prisma.member.create({
      data: {
        id: data.id,
        password: data.password,
        nickname: data.nickname,
        job: data.job,
        jobInfo: data.jobInfo,
        myBadge: data.myBadge,
      }
    });
    return this.changeToMemberItem(member);
  }

  // 로그인 (ID와 비밀번호로 조회)
  async login(id: string, password: string): Promise<MemberItem | null> {
    const member = await prisma.member.findFirst({
      where: {
        id,
        password
      }
    });
    return member ? this.changeToMemberItem(member) : null;
  }

  // 회원 정보 수정
  async updateMember(idx: number, data: {
    nickname?: string;
    job?: string;
    jobInfo?: string;
    myBadge?: string;
  }): Promise<MemberItem> {
    const member = await prisma.member.update({
      where: { idx },
      data
    });
    return this.changeToMemberItem(member);
  }

  // 회원 삭제
  async deleteMember(idx: number): Promise<void> {
    await prisma.member.delete({
      where: { idx }
    });
  }
}


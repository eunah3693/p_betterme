import { prisma } from '@/lib/prisma';
import { MemberItem, SignupRequest, UpdateMemberRequest } from '@/interfaces/member';
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

  // idx와 id로 회원 조회
  async getMemberByIdxAndId(idx: number, id: string): Promise<MemberItem | null> {
    const member = await prisma.member.findFirst({
      where: { idx, id }
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
  async createMember(data: SignupRequest): Promise<MemberItem> {
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

  // 본인 회원 정보 수정
  async updateMemberByIdxAndId(
    idx: number,
    id: string,
    data: Omit<UpdateMemberRequest, 'idx'>
  ): Promise<MemberItem | null> {
    const member = await prisma.member.findFirst({
      where: { idx, id }
    });

    if (!member) {
      return null;
    }

    const updatedMember = await prisma.member.update({
      where: { idx },
      data
    });

    return this.changeToMemberItem(updatedMember);
  }

  async updatePasswordByIdx(idx: number, password: string): Promise<void> {
    await prisma.member.update({
      where: { idx },
      data: { password }
    });
  }

}

import { MemberRepository } from '@/repositories/memberRepository';
import { MemberResponse, CheckIdResponse, SignupRequest, LoginRequest, UpdateMemberRequest, LoginResponse } from '@/interfaces/member';
import { generateToken, JwtPayload } from '@/lib/jwt';
import { ForbiddenError, UnauthorizedError } from '@/lib/errors';
import { hashPassword, verifyPassword } from '@/lib/password';
import { randomBytes } from 'crypto';

export class MemberService {
  private memberRepository: MemberRepository;

  constructor() {
    this.memberRepository = new MemberRepository();
  }

  private generateCsrfToken(): string {
    return randomBytes(32).toString('hex');
  }

  private async validateMemberPayload(payload: JwtPayload, memberIdx: number) {
    if (payload.idx !== memberIdx) {
      throw new ForbiddenError('본인 정보만 조회/수정할 수 있습니다.');
    }

    const member = await this.memberRepository.getMemberByIdxAndId(memberIdx, payload.id);
    if (!member) {
      throw new ForbiddenError('본인 정보만 조회/수정할 수 있습니다.');
    }

    return payload;
  }

  // 회원가입
  async signup(data: SignupRequest): Promise<MemberResponse> {
    // ID 중복 체크
    const exists = await this.memberRepository.checkIdExists(data.id);
    if (exists) {
      return {
        success: false,
        data: null,
        message: '이미 사용 중인 아이디입니다.'
      };
    }

    // 회원가입
    const member = await this.memberRepository.createMember({
      id: data.id,
      password: await hashPassword(data.password),
      nickname: data.nickname,
      job: data.job,
      jobInfo: data.jobInfo,
      myBadge: data.myBadge,
    });

    const { password, ...memberWithoutPassword } = member;
    void password;
    return {
      success: true,
      data: memberWithoutPassword,
      message: '회원가입이 완료되었습니다.',
    };
  }

  // 로그인
  async login(data: LoginRequest): Promise<LoginResponse> {
    const member = await this.memberRepository.getMemberById(data.id);

    if (!member) {
      throw new UnauthorizedError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    const isLegacyPlaintextPassword = !member.password.includes(':');
    const isValidPassword = isLegacyPlaintextPassword
      ? member.password === data.password
      : await verifyPassword(data.password, member.password);

    if (!isValidPassword) {
      throw new UnauthorizedError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    if (isLegacyPlaintextPassword) {
      await this.memberRepository.updatePasswordByIdx(
        member.idx,
        await hashPassword(data.password)
      );
    }

    // JWT 토큰 생성
    const token = generateToken({
      idx: member.idx,
      id: member.id,
      nickname: member.nickname,
    });

    // 비밀번호 제외한 정보 반환
    const { password, ...memberWithoutPassword } = member;
    void password;

    return {
      success: true,
      data: memberWithoutPassword,
      token: token,
      message: '로그인에 성공했습니다.',
    };
  }

  // ID 중복 체크
  async checkId(id: string): Promise<CheckIdResponse> {
    const exists = await this.memberRepository.checkIdExists(id);
    
    return {
      success: true,
      available: !exists,
      message: exists ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.'
    };
  }

  // 회원 정보 조회
  async getMemberByIdx(idx: number, user: JwtPayload): Promise<MemberResponse> {
    try {
      const validatedUser = await this.validateMemberPayload(user, idx);
      const member = await this.memberRepository.getMemberByIdxAndId(idx, validatedUser.id);

      if (!member) {
        return {
          success: false,
          data: null,
          message: '회원을 찾을 수 없습니다.'
        };
      }

      const { password, ...memberWithoutPassword } = member;
      void password;

      return {
        success: true,
        data: memberWithoutPassword,
        csrfToken: this.generateCsrfToken(),
      };
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
        return {
          success: false,
          data: null,
          message: error.message
        };
      }

      return {
        success: false,
        data: null,
        message: '회원 정보를 불러오는데 실패했습니다.'
      };
    }
  }

  // 회원 정보 수정
  async updateMemberInfo(data: UpdateMemberRequest, user: JwtPayload): Promise<MemberResponse> {
    try {
      const validatedUser = await this.validateMemberPayload(user, data.idx);
      const member = await this.memberRepository.updateMemberByIdxAndId(data.idx, validatedUser.id, {
        nickname: data.nickname,
        job: data.job,
        jobInfo: data.jobInfo,
        myBadge: data.myBadge,
      });

      if (!member) {
        return {
          success: false,
          data: null,
          message: '회원 정보를 찾을 수 없거나 수정 권한이 없습니다.'
        };
      }

      const { password, ...memberWithoutPassword } = member;
      void password;

      return {
        success: true,
        data: memberWithoutPassword,
        message: '회원 정보가 수정되었습니다.'
      };
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
        return {
          success: false,
          data: null,
          message: error.message
        };
      }

      console.error('회원 정보 수정 실패:', error);
      return {
        success: false,
        data: null,
        message: '회원 정보 수정에 실패했습니다.'
      };
    }
  }
}

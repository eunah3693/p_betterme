import { MemberRepository } from '@/repositories/memberRepository';
import { MemberResponse, CheckIdResponse, SignupRequest, LoginRequest, UpdateMemberRequest, LoginResponse } from '@/interfaces/member';
import { generateToken } from '@/lib/jwt';
import { UnauthorizedError } from '@/lib/errors';

export class MemberService {
  private memberRepository: MemberRepository;

  constructor() {
    this.memberRepository = new MemberRepository();
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
      password: data.password,
      nickname: data.nickname,
      job: data.job,
      jobInfo: data.jobInfo,
      myBadge: data.myBadge,
    });

    return {
      success: true,
      data: member,
      message: '회원가입이 완료되었습니다.'
    };
  }

  // 로그인
  async login(data: LoginRequest): Promise<LoginResponse> {
    const member = await this.memberRepository.login(data);
    
    if (!member) {
      throw new UnauthorizedError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    // JWT 토큰 생성
    const token = generateToken({
      idx: member.idx,
      id: member.id,
      nickname: member.nickname,
    });

    // 비밀번호 제외한 정보 반환
    const { password, ...memberWithoutPassword } = member;

    return {
      success: true,
      data: memberWithoutPassword,
      token,
      message: '로그인에 성공했습니다.'
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
  async getMemberByIdx(idx: number): Promise<MemberResponse> {
    const member = await this.memberRepository.getMemberByIdx(idx);
    
    if (!member) {
      return {
        success: false,
        data: null,
        message: '회원을 찾을 수 없습니다.'
      };
    }

    return {
      success: true,
      data: member
    };
  }

  // 회원 정보 수정
  async updateMemberInfo(data: UpdateMemberRequest): Promise<MemberResponse> {
    try {
      const member = await this.memberRepository.updateMember(data);
      
      return {
        success: true,
        data: member,
        message: '회원 정보가 수정되었습니다.'
      };
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      return {
        success: false,
        data: null,
        message: '회원 정보 수정에 실패했습니다.'
      };
    }
  }
}


import { ArtRepository } from '@/repositories/artRepository';
import { ArtResponse, RecommendArtResponse, OneArtResponse } from '@/models/Art';
import { ArtSearchParams } from '@/interfaces/arts';

export class ArtService {
  private artRepository: ArtRepository;
  
  constructor() {
    this.artRepository = new ArtRepository();
  }
  
  // 단일 전시회 조회
  async getArtById(id: number): Promise<OneArtResponse> {
    this.artRepository.incrementViewCount(id).catch(err => {
      console.error('조회수 증가 실패:', err);
    });
    
    // 전시회 데이터 조회
    const result = await this.artRepository.findArtById(id);
    return result;
  }
  
  // 무료 전시회 조회
  async getFreeArts(params: ArtSearchParams): Promise<ArtResponse> {
    const result = await this.artRepository.findArts(params);
    return result;
  }
  
  // 추천 전시회 조회
  async getRecommendedArts(params: { size?: number}): Promise<RecommendArtResponse> {
    const result = await this.artRepository.findRecommendedArts(params);
    return result;
  }
  
  // 일반 전시회 조회
  async getArts(params: ArtSearchParams): Promise<ArtResponse> {
    const result = await this.artRepository.findArts(params);
    return result;
  }
}

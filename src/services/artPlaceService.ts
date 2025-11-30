import { ArtPlaceRepository } from '@/repositories/artPlaceRepository';
import { MapResponse } from '@/models/Map';
import { mapPlaceRequestParams, mapPlaceResponse, mapRequestParams } from '@/interfaces/map';

export class ArtPlaceService {
  private ArtPlaceRepository: ArtPlaceRepository;
  
  constructor() {
    this.ArtPlaceRepository = new ArtPlaceRepository();
  }
  
  // 전시회 지도 조회
  async getMapArts(params: mapRequestParams): Promise<MapResponse> {
    const result = await this.ArtPlaceRepository.findPlaceArts(params);
    return result;
  }

  // 전시회 지도 조회
  async getMapPlaceArts(params: mapPlaceRequestParams): Promise<mapPlaceResponse> {
    const result = await this.ArtPlaceRepository.findPlaceCardArts(params.id);
    return result;
  }
}

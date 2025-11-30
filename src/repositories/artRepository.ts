import { prisma } from '@/lib/prisma';
import { Art, ArtResponse, RecommendArtSearchParams, OneArtResponse } from '@/models/Art';
import { ArtSearchParams } from '@/interfaces/arts';
import { Prisma } from '@prisma/client';

export class ArtRepository {
  
  // snake_case를 camelCase로 변환
  private toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  
  // DB 데이터를 Art 모델로 변환
  private changeToArt(dbRow: Prisma.ArtGetPayload<{ include?: { place?: boolean } }>): Art {
    const placeData = 'place' in dbRow ? (dbRow.place as Prisma.PlaceGetPayload<Record<string, never>> | null) : null;
    
    return {
      id: Number(dbRow.id),
      title: dbRow.title,
      artType: dbRow.artType as string,
      artCode: dbRow.artCode as string,
      startDate: dbRow.startDate instanceof Date 
        ? dbRow.startDate.toISOString().split('T')[0] 
        : dbRow.startDate,
      endDate: dbRow.endDate instanceof Date 
        ? dbRow.endDate.toISOString().split('T')[0] 
        : dbRow.endDate,
      price: dbRow.price || '',
      placeName: dbRow.placeName || '',
      area: dbRow.area || '',
      sigungu: dbRow.sigungu || '',
      thumbnail: dbRow.thumbnail || '',
      phone: dbRow.phone || '',
      viewCount: dbRow.viewCount || 0,
      createdAt: dbRow.createdAt,
      updatedAt: dbRow.updatedAt || new Date(),
      // place 정보가 있으면 포함
      place: placeData ? {
        id: Number(placeData.id),
        address: placeData.address || undefined,
        latitude: placeData.latitude || undefined,
        longitude: placeData.longitude || undefined,
        url: placeData.url || undefined,
        seq: placeData.seq || undefined,
      } : undefined,
    };
  }

  // 조회수 증가
  async incrementViewCount(id: number): Promise<void> {
    await prisma.art.update({
      where: { id: BigInt(id) },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
  }

  // 단일 전시회 조회
  async findArtById(id: number): Promise<OneArtResponse> {
    const artData = await prisma.art.findUnique({
      where: { id: BigInt(id) },
      include: {
        place: true
      }
    });

    return {
      content: artData ? this.changeToArt(artData) : null
    }
  }

  // 추천 전시회 조회 
  async findRecommendedArts(params: RecommendArtSearchParams): Promise<ArtResponse> {
    const recommendData = await prisma.artRecommend.findMany({
      take: params.size || 10, 
      include: {
        art: true 
      }
    });

    // 추천 목록에서 art 데이터만 추출
    const arts = recommendData.map(rec => this.changeToArt(rec.art));
    return {
      content: arts
    };
  }

  // 전시회 일반 조회
  async findArts(params: ArtSearchParams): Promise<ArtResponse> {
    // where 조건
    const where: Record<string, unknown> = {};
    
    if (params.artCode) where.artCode = params.artCode as string;
    if (params.artType) where.artType = params.artType as string;
    if (params.title) where.title = { contains: params.title };
    if (params.area) where.area = params.area;
    if (params.sigungu) where.sigungu = params.sigungu;
    if (params.placeName) where.placeName = { contains: params.placeName };
    if (params.price) where.price = { contains: params.price };
    
    // 전시회 기간검색
    if (params.startDate || params.endDate) {
      const startDateFilter: Record<string, unknown> = where.startDate as Record<string, unknown> || {};
      const endDateFilter: Record<string, unknown> = where.endDate as Record<string, unknown> || {};
      
      if (params.endDate) {
        startDateFilter.lte = new Date(params.endDate);
        where.startDate = startDateFilter;
      }
      if (params.startDate) {
        endDateFilter.gte = new Date(params.startDate);
        where.endDate = endDateFilter;
      }
    }
    
    // 진행중인 전시회 필터
    if (params.ongoing) {
      const today = new Date();
      const startDateFilter: Record<string, unknown> = where.startDate as Record<string, unknown> || {};
      const endDateFilter: Record<string, unknown> = where.endDate as Record<string, unknown> || {};
      
      startDateFilter.lte = today;
      endDateFilter.gte = today;
      
      where.startDate = startDateFilter;
      where.endDate = endDateFilter;
    }

    // 정렬 조건 구성
    const orderBy: Record<string, Prisma.SortOrder> = {};
    if (params.sort && params.direction) {
      // snake_case를 camelCase로 변환 (예: view_count -> viewCount)
      const camelField = this.toCamelCase(params.sort);
      orderBy[camelField] = params.direction.toLowerCase() as Prisma.SortOrder;
    } else if (params.sort) {
      // sort가 'view_count,desc' 형식으로 올 경우 처리
      const [field, dir] = params.sort.split(',');
      const camelField = this.toCamelCase(field);
      orderBy[camelField] = (dir || 'asc') as Prisma.SortOrder;
    }

    // 페이지네이션 설정
    const page = params.page ? Number(params.page) : 0;
    const size = params.size ? Number(params.size) : 10;
    
    // where와 orderBy를 Prisma 타입으로 캐스팅
    const prismaWhere = where as Prisma.ArtWhereInput;
    const prismaOrderBy = Object.keys(orderBy).length > 0 ? orderBy as Prisma.ArtOrderByWithRelationInput : undefined;
    
    // 전체 데이터 개수 조회
    const totalElements = await prisma.art.count({ where: prismaWhere });
    
    // 현재 페이지 데이터 조회
    const artData = await prisma.art.findMany({
      where: prismaWhere,
      orderBy: prismaOrderBy,
      skip: page * size,
      take: size,
    });

    const arts = artData.map(rec => this.changeToArt(rec));

    return {
      content: arts,
      page: {
        size: size,
        number: page,
        totalElements: totalElements,
        totalPages: Math.ceil(totalElements / size),
      }
    };
  }

}
import { axiosInstance } from './axios';
import { ArtSearchParams, artResponse, recommendArtResponse, SimpleArtRequestParams, oneArtRequestParams, oneArtResponse } from '@/interfaces/arts';

const ART_URL = '/api/art';
const FREE_URL = '/api/art/free';
const RECOMMEND_URL = '/api/art/recommend';

//전시회 일반 조회
export const getArtsData = async (params: ArtSearchParams) => {
  try {
    const { data } = await axiosInstance.get<artResponse>(ART_URL, {
      params,
    });
    return data;
  } catch (error) {
    console.error('API 호출 실패:', error);
    throw error;
  }
}; 

//비슷한 전시회 조회
export const getSimilarArtData = async (params: ArtSearchParams) => {
  try {
    const { data } = await axiosInstance.get<artResponse>(ART_URL, {
      params,
    });
    return data;
  } catch (error) {
    console.error('API 호출 실패:', error);
    throw error;
  }
}; 

//무료 전시회 조회
export const getFreeArtData = async (params: SimpleArtRequestParams) => {
  try {
    const { data } = await axiosInstance.get<artResponse>(FREE_URL, {
      params,
    });
   
    return data;
  } catch (error) {
    console.error('API 호출 실패:', error);
    throw error;
  }
}; 

//추천 전시회 조회
export const getRecommendArtData = async (params: SimpleArtRequestParams) => {
  try {
    const { data } = await axiosInstance.get<recommendArtResponse>(RECOMMEND_URL, {
      params,
    });
   
    return data;
  } catch (error) {
    console.error('API 호출 실패:', error);
    throw error;
  }
}; 

export const getOneArtData = async (params: oneArtRequestParams) => {
  try {
    const { data } = await axiosInstance.get<oneArtResponse>(`/api/art/${params.id}`);
    console.log('API 응답 데이터:', data);
    return data;
  } catch (error) {
    throw error;
  }
}; 


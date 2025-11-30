import { axiosInstance } from './axios';
import { mapRequestParams, mapResponse, mapPlaceRequestParams, mapPlaceResponse } from '@/interfaces/map';

//지도 전시회 조회
export const getMapData = async (params: mapRequestParams) => {
  try {
    console.log('API 요청 파라미터:', params);
    const { data } = await axiosInstance.post<mapResponse>('/api/map', params);
    console.log('API 응답 데이터:', data);
    return data;
  } catch (error) {
    //console.error('API 요청 실패:', error);
    throw error;
  }
}; 
//지도 마커클릭시 전시회들 조회
// export const getMapPlaceData = async (params: mapPlaceRequestParams) => {
//   try {
//     //console.log('API 요청 파라미터:', params);
//     const { data } = await axiosInstance.get<mapPlaceResponse>(`/api/map/${params.id}`, {
//       params
//     });
//     //console.log('API 응답 데이터:', data);
//     return data;
//   } catch (error) {
//     //console.error('API 요청 실패:', error);
//     throw error;
//   }
// }; 
//지도 드래그시 전시회 조회 
export const getMapCardData = async (params: mapPlaceRequestParams) => {
  try {
    //console.log('API 요청 파라미터:', params);
    const { data } = await axiosInstance.post<mapPlaceResponse>('/api/map/card', params);
    console.log('API 응답 데이터:', data);
    return data;
  } catch (error) {
    //console.error('API 요청 실패:', error);
    throw error;
  }
}; 


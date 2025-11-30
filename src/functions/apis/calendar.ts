
export type calendarProps = (params: calendarRequestParams) => void;

export interface calendarRequestParams {
  artType?: string,
  artCode?: string,
  sigungu?: string,
  startDateFrom?: string,
  startDateTo?: string,
  endDateFrom?: string,
  endDateTo?: string,
  page?: number,
  size?: number,
  sort?: string,
}

export interface calendarParams {
  startDate: string,
  endDate: string,
}


export interface calendarItem {
  id?: number,
  start?: string,
  end?: string,
  title?: string,
  calenderType?: number,
}

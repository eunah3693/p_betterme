'use client';

import { useReportWebVitals } from 'next/web-vitals';

const reportWebVitals: Parameters<typeof useReportWebVitals>[0] = (metric) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
};

export default function WebVitals() {
  useReportWebVitals(reportWebVitals);

  return null;
}

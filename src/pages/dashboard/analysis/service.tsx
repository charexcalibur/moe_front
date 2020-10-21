import request from '@/utils/request';

export async function fakeChartData() {
  return request('/api/getBlogAnalysis');
}

export async function getBlogAnalysis() {
  return request('/api/getBlogAnalysis');
}
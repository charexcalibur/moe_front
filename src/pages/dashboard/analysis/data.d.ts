/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 23:02:34
 * @LastEditors: hayato
 * @LastEditTime: 2020-09-22 16:48:40
 */
export interface VisitDataType {
  x: string;
  y: number;
}

export interface SearchDataType {
  index: number;
  keyword: string;
  count: number;
  range: number;
  status: number;
}

export interface OfflineDataType {
  name: string;
  cvr: number;
}

export interface OfflineChartData {
  x: any;
  y1: number;
  y2: number;
}

export interface RadarData {
  name: string;
  label: string;
  value: number;
}

export interface BlogData {
  totalBlogCount: number;
}

export interface AnalysisData {
  visitData: VisitDataType[];
  visitData2: VisitDataType[];
  salesData: VisitDataType[];
  searchData: SearchDataType[];
  offlineData: OfflineDataType[];
  offlineChartData: OfflineChartData[];
  salesTypeData: VisitDataType[];
  salesTypeDataOnline: VisitDataType[];
  salesTypeDataOffline: VisitDataType[];
  radarData: RadarData[];
  blogData: BlogData;
}

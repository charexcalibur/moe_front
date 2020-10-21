/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 23:02:43
 * @LastEditors: hayato
 * @LastEditTime: 2020-05-08 15:34:53
 */
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

// export async function fakeChartData() {
//   return request('/api/fake_chart_data');
// }

export async function queryCurrent() {
  return request('/rbac/auth/info');
}

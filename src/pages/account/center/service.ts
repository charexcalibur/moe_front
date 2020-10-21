/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 23:04:11
 * @LastEditors: hayato
 * @LastEditTime: 2020-05-14 12:14:42
 */
import request from '@/utils/request';

export async function queryCurrent() {
  return request('rbac/auth/info');
}

export async function queryFakeList(params: { limit: number }) {
  return request('/api/fake_list', {
    params,
  });
}

/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 23:04:15
 * @LastEditors: hayato
 * @LastEditTime: 2020-05-08 15:33:55
 */
import request from '@/utils/request';

export async function queryCurrent() {
  return request('/rbac/auth/info');
}

export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province: string) {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}

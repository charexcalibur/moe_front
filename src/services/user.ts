/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 17:36:19
 * @LastEditors: hayato
 * @LastEditTime: 2020-09-28 13:22:05
 */
import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  console.log('queryCurrent: ')
  return request('/api/currentUser/');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-10-21 16:52:22
 * @LastEditors: hayato
 * @LastEditTime: 2020-10-21 17:18:56
 */
import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/menus/');
}
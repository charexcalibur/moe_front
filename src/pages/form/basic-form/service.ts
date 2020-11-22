/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 23:02:47
 * @LastEditors: hayato
 * @LastEditTime: 2020-11-16 20:31:39
 */
import request from '@/utils/request';

export async function fakeSubmitForm(params: any) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}


export async function getQiniuToken() {
  return request('/api/getQiniuToken', {
    method: 'GET',
  });
}
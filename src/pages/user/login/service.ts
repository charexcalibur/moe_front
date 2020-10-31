/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 23:02:18
 * @LastEditors: hayato
 * @LastEditTime: 2020-10-30 21:26:29
 */
import request from '@/utils/request';

export interface LoginParamsType {
  username: string;
  password: string;
}

export async function AccountLogin(params: LoginParamsType) {
  return request('/api/login', {
    method: 'POST',
    data: params
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

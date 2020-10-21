/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 17:36:19
 * @LastEditors: hayato
 * @LastEditTime: 2020-09-14 14:27:19
 */
import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('https://api.axis-studio.org/api/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}


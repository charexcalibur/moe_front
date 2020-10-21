/*
 * @Description: Description'
 * @Author: hayato
 * @Date: 2020-03-17 23:02:18
 * @LastEditors: hayato
 * @LastEditTime: 2020-09-28 14:52:40
 */
import { parse } from 'qs';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function setAuthority(authority: string | string[]) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;

  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  // hard code
  // reload Authorized component
  try {
    if ((window as any).reloadAuthorized) {
      (window as any).reloadAuthorized();
    }
  } catch (error) {
    // do not need do anything
  }

  return authority;
}

export function setToken(token: string) {
  sessionStorage.setItem('token', token);
}


/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 23:03:08
 * @LastEditors: hayato
 * @LastEditTime: 2022-04-30 16:39:11
 */
import request from '@/utils/request';
import { BasicListItemDataType } from './data.d';

interface ParamsType extends Partial<BasicListItemDataType> {
  limit?: number;
  page?: number;
  search?: number;
}

interface postQuotationType {
  author: string;
  content: string;
}

interface putQuotationType {
  id: string;
  author: string;
  content: string;
}

interface deleteQuotationType {
  id: string;
}

export async function queryQuotationsList(params: ParamsType) {
  return request('/fhc/quotations/', {
    params,
  });
}

export async function postQuotation(params: postQuotationType) {
  return request('/fhc/quotations/', {
    method: 'POST',
    data: {...params}
  });
}

export async function putQuotation(params: putQuotationType) {
  return request(`/fhc/quotations/${params.id}/`, {
    method: 'PUT',
    data: {...params}
  });
}

export async function deleteQuotation(params: deleteQuotationType) {
  return request(`/fhc/quotations/${params.id}/`, {
    method: 'DELETE'
  });
}

export async function removeFakeList(params: ParamsType) {
  const { limit = 5, ...restParams } = params;
  return request('/rbac/rbac_api/users/', {
    method: 'POST',
    params: {
      limit,
    },
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params: ParamsType) {
  const { limit = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      limit,
    },
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params: ParamsType) {
  const { limit = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      limit,
    },
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function getQiniuToken(params?: {
  name: string
  prefix: string
}) {
  console.log('in get qiniu token')
  return request('/api/getQiniuToken', {
    method: 'GET',
    params
  });
}
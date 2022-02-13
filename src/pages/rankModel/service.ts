/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2021-06-03 15:11:29
 * @LastEditors: hayato
 * @LastEditTime: 2021-06-04 14:56:38
 */
import request from '@/utils/request';
import { RankModelItemDataType } from './data.d'

export async function queryRankModelList(params: any) {
  return request('/dota/rankmodels/', {
    params
  })
}
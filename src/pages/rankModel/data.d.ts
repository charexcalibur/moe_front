/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2021-06-03 15:15:50
 * @LastEditors: hayato
 * @LastEditTime: 2021-06-04 14:54:12
 */
export interface RankModelItemDataType {
  id: number;
  add_time: string;
  modify_time: string;
  title: string;
  sub_title: string;
  des: string;
  rank_url: string;
}

export interface RankModelListDataType {
  count: number;
  next: any;
  previous: any;
  results: RankModelItemDataType[]
}
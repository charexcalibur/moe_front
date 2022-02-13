/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-02-13 17:29:01
 * @LastEditors: hayato
 * @LastEditTime: 2022-02-13 17:29:01
 */
import request from '@/utils/request'

export async function queryPhotoList(params: any) {
  return request('/wallpaper/wallpapers/', {
    params
  })
}
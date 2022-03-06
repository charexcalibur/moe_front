/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-02-13 17:29:01
 * @LastEditors: hayato
 * @LastEditTime: 2022-02-28 21:52:12
 */
import request from '@/utils/request'

export async function queryPhotoList(params: any) {
  return request('/wallpaper/wallpapers/', {
    params
  })
}

export async function patchPhotoInfo(params: any) {
  console.log('in patchPhotoInfo: ', params)
  const id = params.id
  delete params.id
  return request(`/wallpaper/wallpapers/${id}/`, {
    method: 'PATCH',
    data: {...params}
  })
}

export async function addPhotoInfo(params: any) {
  return request(`/wallpaper/wallpapers/`, {
    method: 'POST',
    data: {...params}
  })
}

export async function queryTags(params: any) {
  return request('/wallpaper/tags/', {
    params
  })
}

export async function queryCategory(params: any) {
  return request('/wallpaper/category/', {
    params
  })
}

export async function queryEquipments(params: any) {
  return request('/wallpaper/equipments/', {
    params
  })
}
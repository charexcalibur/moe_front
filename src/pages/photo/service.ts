/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-02-13 17:29:01
 * @LastEditors: hayato
 * @LastEditTime: 2022-05-04 22:23:22
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

export async function deletePhotoInfo(params: any) {
  const id = params.id
  return request(`/wallpaper/wallpapers/${id}/`, {
    method: 'DELETE'
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

export async function createImageSizes(params: {
  width?: string
  height?: string
  cdn_url?: string
  type: number
  image: number
}) {
  return request('/wallpaper/imagesizes/', {
    method: 'POST',
    data: {...params}
  })
}

export async function patchImageSizes(params: {
  id: number
  width: string
  height: string
  cdn_url: string
  type: number
  image?: number
}) {
  return request(`/wallpaper/imagesizes/${params.id}/`, {
    method: 'PATCH',
    data: {...params}
  })
}

export async function deleteImageSizes(params: {
  id: number
}) {
  return request(`/wallpaper/imagesizes/${params.id}/`, {
    method: 'DELETE'
  })
}
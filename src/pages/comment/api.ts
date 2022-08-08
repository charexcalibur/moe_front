import request from '@/utils/request'

export async function queryCommentsList(params: any) {
  return request('/wallpaper/comments/', {
    params
  })
}

export async function patchCommentInfo(params: any) {
  const id = params.id
  delete params.id
  return request(`/wallpaper/comments/${id}/`, {
    method: 'PATCH',
    data: {...params}
  })
}
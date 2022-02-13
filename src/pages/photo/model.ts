/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-02-13 17:28:47
 * @LastEditors: hayato
 * @LastEditTime: 2022-02-13 21:50:44
 */
import { queryPhotoList } from './service'
import { ModelType, } from './data.d'


const Model: ModelType = {
  namespace: 'photoList',
  state: {
    results: [],
    total: 0
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPhotoList, payload)
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.results) ? response: []
      })
    }
  },
  reducers: {
    queryList(state, action) {
      return {
        ...state,
        results: action.payload.results,
        total: action.payload.count
      }
    }
  }
}

export default Model
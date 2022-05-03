/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-02-13 17:28:47
 * @LastEditors: hayato
 * @LastEditTime: 2022-04-30 17:52:18
 */
import { queryPhotoList, patchPhotoInfo, addPhotoInfo, queryTags, queryCategory, queryEquipments } from './service'
import { ModelType, StateType} from './data.d'

const defaultState = {
  results: [],
  total: 0,
  tagsResults: [],
  totalTags: 0,
  equipmentsResults: [],
  totalEquipments: 0,
  categoryResults: [],
  totalCategory: 0,
  loading: true
}

const Model: ModelType = {
  namespace: 'photoList',
  state: {
    results: [],
    total: 0,
    tagsResults: [],
    totalTags: 0,
    equipmentsResults: [],
    totalEquipments: 0,
    categoryResults: [],
    totalCategory: 0,
    loading: false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPhotoList, payload)
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.results) ? response: []
      })
    },
    *patchPhoto({ payload }, { call }) {
      yield call(patchPhotoInfo, payload)
    },
    *addPhoto({ payload }, { call }) {
      yield call(addPhotoInfo, payload)
    },
    *fetchTags({ payload }, { call, put}) {
      const response = yield call(queryTags, payload)
      yield put({
        type: 'queryTags',
        payload: Array.isArray(response.results) ? response: []
      })
    },
    *fetchCategory({ payload }, { call, put}) {
      const response = yield call(queryCategory, payload)
      yield put({
        type: 'queryCategory',
        payload: Array.isArray(response.results) ? response: []
      })
    },
    *fetchEquipments({ payload }, { call, put}) {
      const response = yield call(queryEquipments, payload)
      yield put({
        type: 'queryEquipments',
        payload: Array.isArray(response.results) ? response: []
      })
    },
  },
  reducers: {
    queryList(state = defaultState, action) {
      return {
        ...state,
        results: action.payload.results,
        total: action.payload.count,
        loading: false
      }
    },
    queryTags(state = defaultState, action) {
      return {
        ...state,
        tagsResults: action.payload.results,
        totalTags: action.payload.count,
        loading: false
      }
    },
    queryCategory(state = defaultState, action) {
      return {
        ...state,
        categoryResults: action.payload.results,
        totalCategory: action.payload.count,
        loading: false
      }
    },
    queryEquipments(state = defaultState, action) {
      return {
        ...state,
        equipmentsResults: action.payload.results,
        totalEquipments: action.payload.count,
        loading: false
      }
    }
  }
}

export default Model
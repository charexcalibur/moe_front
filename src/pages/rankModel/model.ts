/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2021-06-03 15:11:17
 * @LastEditors: hayato
 * @LastEditTime: 2021-06-04 15:12:17
 */
import { AnyAction, Reducer } from 'redux'
import { EffectsCommandMap } from 'dva'
import { queryRankModelList } from './service'

import { RankModelListDataType, RankModelItemDataType } from './data.d'

export interface StateType {
  list?: RankModelItemDataType[];
  total?: number;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    // appendFetch: Effect;
    // submit: Effect;
    // edit: Effect;
    // delete: Effect;
    // search: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    // appendList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'rankModelList',

  state: {
    list: [],
    total: 0
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRankModelList, payload)
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.results) ? response : []
      })
    }
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload.results,
        total: action.payload.count
      }
    }
  }
}

export default Model;
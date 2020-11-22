/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 23:02:47
 * @LastEditors: hayato
 * @LastEditTime: 2020-11-16 21:39:59
 */
import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { fakeSubmitForm, getQiniuToken } from './service';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface StateType {
  qiniuToken: string;
}

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    submitRegularForm: Effect;
    getQiniuToken: Effect;
  };
  reducers: {
    setToken: Reducer<StateType>;
  }
}
const Model: ModelType = {
  namespace: 'formAndbasicForm',

  state: {},

  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *getQiniuToken({ payload }, { call, put }) {
      const response = yield call(getQiniuToken, payload);
      yield put({
        type: 'setToken',
        payload: response.token ? response : ''
      })
    }
  },

  reducers: {
    setToken(state, action) {
      return {
        ...state,
        qiniuToken: action.payload.token
      }
    }
  }
};

export default Model;

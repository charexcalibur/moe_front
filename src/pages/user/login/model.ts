/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 23:02:18
 * @LastEditors: hayato
 * @LastEditTime: 2020-10-30 21:26:56
 */
import { AnyAction, Reducer } from 'redux';
import { message } from 'antd';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { AccountLogin, getFakeCaptcha } from './service';
import { getPageQuery, setAuthority, setToken } from './utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    // getCaptcha: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userAndlogin',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(AccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      console.log('response: ', response)
      // Login successfully
      if (response.error_no === '1004') {
        message.success('登录成功！');
        yield setToken(response.token)
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      } else if(response.status === '1004') {
        message.success('账号密码错误！');
      } else {
        message.success(response.msg);
      }
    },

    // *getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log('payload: ', payload)
      setAuthority(payload.currentAuthority);

      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;

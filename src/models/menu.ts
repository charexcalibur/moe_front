/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-10-21 16:51:13
 * @LastEditors: hayato
 * @LastEditTime: 2020-10-31 15:45:28
 */
import { query } from '@/services/menu';
import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';

export interface StateType {
  menuData: []
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface MenuModelState {
  [x: string]: any;
  
}

export interface MenuModelType {
  namespace: string;
  state: MenuModelState;
  effects: {
    getMenuData: Effect;
  };
  reducers: {
    save: Reducer<MenuModelState>;
  };
}

const MenuModel: MenuModelType = {
  namespace: 'menu',
  state: {
    menuData: [],
  },
  effects: {
    *getMenuData({callback }, { call, put }) {
      const response = yield call(query);
      yield put({
        type: 'save',
        payload: response.results,
      });
      if (callback) callback(response.results);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        menuData: action.payload || [],
      };
    },
  },
};
export default MenuModel;
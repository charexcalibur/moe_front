import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { AnalysisData } from './data.d';
import { fakeChartData, getBlogAnalysis } from './service';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: AnalysisData) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: AnalysisData;
  effects: {
    fetch: Effect;
    fetchSalesData: Effect;
    fetchBlogData: Effect;
  };
  reducers: {
    save: Reducer<AnalysisData>;
    clear: Reducer<AnalysisData>;
  };
}

const initState = {
  visitData: [],
  visitData2: [],
  salesData: [],
  searchData: [],
  offlineData: [],
  offlineChartData: [],
  salesTypeData: [],
  salesTypeDataOnline: [],
  salesTypeDataOffline: [],
  radarData: [],
  blogData: {
    totalBlogCount: 0
  }
};

const Model: ModelType = {
  namespace: 'dashboardAndanalysis',

  state: initState,

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          blogData: {
            totalBlogCount: response.result.total_blog_count
          }
        },
      });
    },
    *fetchSalesData(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
    *fetchBlogData(_, {call, put}) {
      const response = yield call(getBlogAnalysis);
      yield put({
        type: 'save',
        payload: {
          blogData: {
            totalBlogCount: response.result.total_blog_count
          }
        },
      })
    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return initState;
    },
  },
};

export default Model;

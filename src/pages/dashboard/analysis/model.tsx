import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { AnalysisData } from './data.d';
import { fakeChartData, getBlogAnalysis, getQuotationsStatistic } from './service';
import { AlignLeftOutlined } from '@ant-design/icons';

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
    fetchQuotationsStatistic: Effect;
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
    totalBlogCount: 0,
    quoData: 0
  }
};

const Model: ModelType = {
  namespace: 'dashboardAndanalysis',

  state: initState,

  effects: {
    *fetch(_, { call, put, all }) {
      const [response, quo_res] = yield all([
        call(fakeChartData),
        call(getQuotationsStatistic)
      ])

      console.log('response', response)
      console.log('quo_res', quo_res)

      yield put({
        type: 'save',
        payload: {
          blogData: {
            totalBlogCount: response.result.total_blog_count,
            quoData: quo_res.total_quotations
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
    },
    *fetchQuotationsStatistic(_, {call, put}) {
      const response = yield call(getQuotationsStatistic);
      yield put({
        type: 'save',
        payload: {
          blogData: {
            quoData: response.total_quotations
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

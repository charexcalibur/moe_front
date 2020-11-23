
import React, { FC, Suspense, useEffect } from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
// import { RangePickerValue } from 'antd/es/date-picker/interface';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { AnalysisData } from './data.d';
import styles from './style.less';

import IntroduceRow from './components/IntroduceRow'
interface AnalysisProps {
  dashboardAndanalysis: AnalysisData;
  dispatch: Dispatch<any>;
  loading: boolean;
}

export const  Analysis: FC<AnalysisProps> = props => {
  const {
    dashboardAndanalysis: {
      blogData
    },
    loading,
    dispatch
  } = props;

  useEffect(() => {
    dispatch({
      type: 'dashboardAndanalysis/fetch'
    });
  }, [])


  return (
    <div>
      <GridContent>
        <React.Fragment>
          {/* <Suspense fallback={<PageLoading />}> */}
            <IntroduceRow loading={loading} visitData={blogData} />
          {/* </Suspense> */}
        </React.Fragment>
      </GridContent>
    </div>
  );
}

export default connect(
  ({
    dashboardAndanalysis,
    loading,
  }: {
    dashboardAndanalysis: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    dashboardAndanalysis,
    loading: loading.effects['dashboardAndanalysis/fetch'],
  }),
)(Analysis);

import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import React from 'react'; // import numeral from 'numeral';

import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from './Charts';
import { BlogData } from '../data.d';
import Trend from './Trend';
import styles from '../style.less';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const IntroduceRow = ({ loading, visitData }: { loading: boolean; visitData: BlogData }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="博客总数"
        total={visitData.totalBlogCount}
        loading={loading}
        contentHeight={46}
        action={
          <Tooltip title="指标说明">
            <InfoCircleOutlined />
          </Tooltip>
        }
        footer={
          <a href="https://blog.axis-studio.org" target="blank">
            https://blog.axis-studio.org
          </a>
        }
      />
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="语录总数"
        action={
          <Tooltip title="指标说明">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={visitData.quoData} // footer={
        //   <Field
        //     label={
        //       <FormattedMessage
        //         id="dashboardandanalysis.analysis.day-visits"
        //         defaultMessage="Daily Visits"
        //       />
        //     }
        //     value={numeral(1234).format('0,0')}
        //   />
        // }
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={[]} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="支付笔数"
        action={
          <Tooltip title="指标说明">
            <InfoCircleOutlined />
          </Tooltip>
        } // total={numeral(6560).format('0,0')}
        footer={<Field label="转化率" value="60%" />}
        contentHeight={46}
      >
        {/* <MiniBar data={visitData} /> */}
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title="运营活动效果"
        action={
          <Tooltip title="指标说明">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total="78%"
        footer={
          <div
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            <Trend
              flag="up"
              style={{
                marginRight: 16,
              }}
            >
              周同比
              <span className={styles.trendText}>12%</span>
            </Trend>
            <Trend flag="down">
              日同比
              <span className={styles.trendText}>11%</span>
            </Trend>
          </div>
        }
        contentHeight={46}
      >
        <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;

/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2021-06-03 15:10:49
 * @LastEditors: hayato
 * @LastEditTime: 2021-06-04 17:01:55
 */
import React, { FC, useRef, useState, useEffect } from 'react'
import { Card, Col, Row, Table, Button, Layout, Space } from 'antd'
import { StateType } from './model'
import { Dispatch } from 'redux'
import { connect } from 'dva'
import { uniqueId } from 'lodash'
import styles from './style.less'

const { Content } = Layout

interface RankModelListProps {
  rankModelList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

export const RankModelList: FC<RankModelListProps> = props => {
  const {
    loading,
    dispatch,
    rankModelList: { list, total },
  } = props

  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    dispatch({
      type: 'rankModelList/fetch',
      payload: {
        limit: 10,
        page
      },
    });
  }, []);

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '副标题',
      dataIndex: 'sub_title',
      key: 'sub_title'
    },
    {
      title: '描述',
      dataIndex: 'des',
      key: 'des'
    },
    {
      title: '模型地址',
      dataIndex: 'rank_url',
      key: 'rank_url'
    }
  ]

  return(
    <Layout>
      <Content>
        <Space direction="vertical" className={styles.content}>
          <Button>
            新增模型
          </Button>
          <Table
            columns={columns}
            dataSource={list}
            rowKey={() => uniqueId()}
          ></Table>
        </Space>
      </Content>
    </Layout>
  )
}

export default connect(
  (
    {
      rankModelList,
      loading,
    }: {
      rankModelList: StateType;
      loading: {
        models: { [key: string]: boolean };
      };
    }
  ) => ({
    rankModelList,
    loading: loading.models.rankModelList
  })
)(RankModelList)
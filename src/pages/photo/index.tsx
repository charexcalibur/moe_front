/*
 * @Description: page for photo upload stuff
 * @Author: hayato
 * @Date: 2022-02-13 17:25:03
 * @LastEditors: hayato
 * @LastEditTime: 2022-04-30 15:34:35
 */

import React, { FC, useRef, useState, useEffect } from 'react';
import { Modal, Card, Col, Row, Table, Button, Layout, Space } from 'antd'
import { Dispatch } from 'redux'
import { connect } from 'dva'
import { uniqueId } from 'lodash'
import styles from './style.less'
import { PhotoListItemType, StateType } from './data.d'
import PhotoModel  from './components/photoModel'

const { Content } = Layout

interface PhotoListProps {
  photoList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

export const Photo: FC<PhotoListProps> = (props) => {
  const {
    loading,
    dispatch,
    photoList: {
      results,
      total
    } 
  } = props


  const [page, setPage] = useState<number>(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [current, setCurrent] = useState<Partial<PhotoListItemType> | undefined>(undefined)
  const [done, setDone] = useState<boolean>(false)
  const [modelType, setModelType] = useState<number>(0) // 0 for new, 1 for edit
  const [limit, setLimit] = useState<number>(10)
  useEffect(() => {
    dispatch({
      type: 'photoList/fetch',
      payload: {
        limit,
        page,
        ordering: '-add_time'
      }
    })
  }, [])

  // const setAddBtnblur = () => {
  //   if (addBtn.current) {
  //     // eslint-disable-next-line react/no-find-dom-node
  //     const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
  //     setTimeout(() => addBtnDom.blur(), 0);
  //   }
  // }

  const _showPhoto = (record: PhotoListItemType) => {
    setCurrent(record)
    setModelType(1)
    setIsModalVisible(true)
    console.log(record)
  }

  const _addNewPhoto = () => {
    setCurrent(undefined)
    setModelType(0)
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    setCurrent(undefined)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setCurrent(undefined)
  }

  const handleDone = () => {
    dispatch({
      type: 'photoList/fetch',
      payload: {
        limit,
        page,
        ordering: '-add_time'
      }
    })
    setDone(false)
    setIsModalVisible(false)
  }

  const SubmitForm = (current: any) => {
    console.log('SubmitForm: ', current)
    // setAddBtnblur()
    if (current?.id) {
      console.log('dispatch patch')
      dispatch({
        type: 'photoList/patchPhoto',
        payload: {...current}
      })
    } else {
      dispatch({
        type: 'photoList/addPhoto',
        payload: {...current}
      })
    }
    setDone(true)
    setCurrent(undefined)
  }

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'des',
      dataIndex: 'des',
      key: 'des'
    },
    {
      title: 'action',
      dataIndex: 'rank_url',
      render: (text: any, record: PhotoListItemType, index: number) => {
        return (
          <Space size="middle">
            <Button onClick={() => _showPhoto(record)} type="link">查看</Button>
          </Space>
        )
      }
    }
  ]

  const handlePageChange = (_page: number) => {
    let payload = {}
    payload = {
      limit,
      page: _page,
      ordering: '-add_time'
    }
    dispatch({
      type: 'photoList/fetch',
      payload
    });
    setPage(_page)
  }

  const handlePageSizeChange = (pageSize: number) => {
    let payload = {}
    payload = {
      limit: pageSize,
      page,
      ordering: '-add_time'
    }
    dispatch({
      type: 'photoList/fetch',
      payload
    });
    setLimit(pageSize)
  }

  const paginationProps = {
    onChange: (_page: number) => handlePageChange(_page),
    onShowSizeChange: (_current: number, pageSize: number) =>  handlePageSizeChange(pageSize),
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: limit,
    current: page,
    total,
    pageSizeOptions: [
      '5',
      '10',
      '20',
      '50'
    ]
  }

  return (
    <Layout>
      <Content>
        <Space direction="vertical" className={styles.content}>
          <Button onClick={_addNewPhoto}>
            新增图片
          </Button>
          <Table
            columns={columns}
            dataSource={results}
            pagination={paginationProps}
            rowKey={() => uniqueId()}
          ></Table>
        </Space>
      </Content>
      <PhotoModel
        done={done}
        destroyOnClose={true}
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={SubmitForm}
        current={current}
        onDone={handleDone}
        type={modelType}
      ></PhotoModel>
    </Layout>
  )
}

export default connect(
  (
    {
      photoList,
      loading
    }: {
      photoList: StateType;
      loading: {
        models: {
          [keys: string]: boolean
        }
      }
    }
  ) => (
    {
      photoList,
      loading: loading.models.photoList
    }
  )
)(Photo)
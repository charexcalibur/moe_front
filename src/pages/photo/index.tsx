/*
 * @Description: page for photo upload stuff
 * @Author: hayato
 * @Date: 2022-02-13 17:25:03
 * @LastEditors: hayato
 * @LastEditTime: 2022-06-20 22:07:39
 */

import React, { FC, useRef, useState, useEffect } from 'react';
import { Modal, Card, Col, Row, Table, Button, Layout, Space } from 'antd'
import { Dispatch } from 'redux'
import { connect } from 'dva'
import { uniqueId } from 'lodash'
import styles from './style.less'
import { PhotoListItemType, StateType } from './data.d'
import PhotoModel  from './components/photoModel'
import UploadModel  from './components/uploadModel'
import { createImageSizes, patchPhotoInfo, deletePhotoInfo } from '@/pages/photo/service'
const { Content } = Layout
const { confirm } = Modal
interface PhotoListProps {
  photoList: StateType;
  dispatch: Dispatch<any>;
}

export const Photo: FC<PhotoListProps> = (props) => {
  const {
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
  const [isUploadModelVisible, setIsUploadModelVisible] = useState(false)
  const [imageType, setImageType] = useState<number>(0) // 1 for origin, 2 for 4k, 3 for thumbnail
  const [imageSizesCurrent, setImageSizesCurrent] = useState<any>({})
  const [shouldPatchInfo, setShouldPatchInfo] = useState<boolean>(false)

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

  const reloadTable = () => {
    dispatch({
      type: 'photoList/fetch',
      payload: {
        limit,
        page,
        ordering: '-add_time'
      }
    })
  }


  const _showPhoto = (record: PhotoListItemType) => {
    setCurrent(record)
    setModelType(1)
    setIsModalVisible(true)
    console.log('_showPhoto: ', record)
  }

  const _showUpload = async (record: PhotoListItemType, type: number) => {
    const res = await createImageSizes({
      image: record.id,
      type
    })
    if (record.aperture === '') {
      setShouldPatchInfo(true)
    } else {
      setShouldPatchInfo(false)
    }
    setImageSizesCurrent(res)
    setImageType(type)
    setIsUploadModelVisible(true)
  }

  const editPhoto = (record: PhotoListItemType, type: number) => {
    console.log('editPhoto: ', record, type)
    const current = record.image_sizes.filter(item => item.type === type)
    console.log('edit photo current: ', current)
    setImageSizesCurrent(current[0])
    setImageType(type)
    setIsUploadModelVisible(true)
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
    reloadTable()
  }

  const handleUploadCancel = () => {
    setIsUploadModelVisible(false)
    setImageSizesCurrent({})
    reloadTable()
  }

  const handleDelete = (id: number) => {
    confirm({
      title: 'Are you sure delete this photo?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        await deletePhotoInfo({id})
        reloadTable()
      },
    })
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

  const handleImageShown = async (id: number, is_show: string) => {
    if (is_show === '1') {
     await patchPhotoInfo({
        id,
        is_shown: '0'
     })
     reloadTable()
    } else {
      await patchPhotoInfo({
        id,
        is_shown: '1'
      })
      reloadTable()
    }
  }

  const SubmitForm = (current: any) => {
    console.log('SubmitForm: ', current)
    // setAddBtnblur()
    if (current?.id) {
      console.log('dispatch patch')
      dispatch({
        type: 'photoList/patchPhoto',
        payload: {current, query: {
          limit,
          page,
          ordering: '-add_time'
        }}
      })
    } else {
      dispatch({
        type: 'photoList/addPhoto',
        payload: {current, query: {
          limit,
          page,
          ordering: '-add_time'
        }}
      })
    }
    setDone(true)
    setCurrent(undefined)
    setIsModalVisible(false)
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
      title: 'location',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'shooting_date',
      dataIndex: 'shooting_date',
      key: 'shooting_date'
    },
    {
      title: 'action',
      render: (text: any, record: PhotoListItemType, index: number) => {
        return ([
          <Space size="middle">
            <Button onClick={() => _showPhoto(record)} type="link">编辑</Button>
          </Space>,
          <Space size="middle">
            {
              (record.image_sizes?.length === 2 || record.image_sizes.filter(item => item.type === 2).length === 1)
              ? <Button
                  onClick={() => editPhoto(record, 2)}
                  type="link"
                >编辑 4k</Button>
              : <Button
                  disabled={record.image_sizes?.length === 2 || record.image_sizes.filter(item => item.type === 2).length === 1}
                  onClick={() => _showUpload(record, 2)}
                  type="link"
                >上传 4k</Button>
            }

            <Button
              disabled={record.image_sizes?.length === 2 || record.image_sizes.filter(item => item.type === 3).length === 1}
              onClick={() => _showUpload(record, 3)} type="link">上传 thumbnail</Button>
            <Button
              type="link"
              onClick={() => handleImageShown(record.id, record.is_shown)}
            >{ record.is_shown === '1' ? '下线' : '上线' }</Button>
            <Button
              type="link"
              onClick={() => handleDelete(record.id)}
            >删除</Button>
          </Space>
        ])
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
            新增图片信息
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
      <UploadModel
        destroyOnClose={true}
        visible={isUploadModelVisible}
        onCancel={handleUploadCancel}
        current={imageSizesCurrent}
        imageType={imageType}
        shouldPatchInfo={shouldPatchInfo}
      ></UploadModel>
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
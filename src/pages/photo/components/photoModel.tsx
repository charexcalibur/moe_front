/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-02-16 22:41:51
 * @LastEditors: hayato
 * @LastEditTime: 2022-03-06 23:26:42
 */
import React, { FC, useRef, useState, useEffect } from 'react'
import { Modal, Form, Button, Input, Result, Upload, message, Select } from 'antd'
import { Dispatch } from 'redux'
import { connect } from 'dva'
import { uniqueId } from 'lodash'
import styles from '../style.less'
import { PhotoListItemType, StateType } from '../data'
import { PlusOutlined } from '@ant-design/icons'
import { any } from 'prop-types'

const { Option } = Select

type TagsResultsItemType = {

}

interface PhotoModelProps {
  done?: boolean;
  visible: boolean;
  current: Partial<PhotoListItemType> | undefined;
  onDone: () => void;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  dispatch: Dispatch<any>;
  destroyOnClose: boolean;
  type: number;
  photoList: any;
}

const PhotoModel: FC<PhotoModelProps> = props => {
  const [form] = Form.useForm();
  console.log('props: ', props)
  const {
    done,
    type,
    destroyOnClose,
    visible,
    onCancel,
    current,
    onSubmit,
    onDone,
    dispatch,
    photoList,
  } = props

  const {
    categoryResults,
    equipmentsResults,
    tagsResults
  } = photoList


  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState(undefined)
  const [tagsSelect, setTagsSelect] = useState(current?.tags?.map(item => item.id))
  const [categorySelect, setCategorySelect] = useState(current?.categories?.map(item => item.id))
  const [equipmentsSelect, setEquipmentsSelect] = useState(current?.equipments?.map(item => item.id))

  useEffect(() => {
    if (form && !visible) {
      console.log('reset fields')
      form.resetFields();
    }
  }, [props.visible])

  useEffect(() => {
    console.log('current: ', current)
    if (current) {
      form.setFieldsValue({
        ...current
      })
    }
  }, [props.current])

  useEffect(() => {
    dispatch({
      type: 'photoList/fetchTags',
      payload: {
        limit: 100,
      }
    })
  }, [])

  useEffect(() => {
    dispatch({
      type: 'photoList/fetchCategory',
      payload: {
        limit: 100,
      }
    })
  }, [])

  useEffect(() => {
    dispatch({
      type: 'photoList/fetchEquipments',
      payload: {
        limit: 100,
      }
    })
  }, [])

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 32 }
  }

  const handleSubmit = () => {
    if (!form) return
    form.submit()
  }

  const handleFinish = (value: any) => {
    value['id'] = current?.id
    value['tags'] = tagsSelect
    value['categories'] = categorySelect
    value['equipments'] = equipmentsSelect
    onSubmit(value)
  }

  const modalFooter = !visible
    ? { footer: null, onCancel: onCancel }
    : { okText: '保存', onOk: handleSubmit, onCancel }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const getImageList = () => {
    if (current?.image_sizes === undefined) {
      return <></>
    }
    const fileList = !current ? [] : current.image_sizes.map(item => {
      return {
        uid: item.id,
        url: item.cdn_url,
        name: current.name === undefined ? '' : current.name,
        size: '',
        type: ''
      }
    })
    return (
      <div>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          beforeUpload={beforeUpload}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
      </div>
    )
  }

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handlePreview = (file: any) => {
    console.log('handle preview: ', file)
    setPreviewVisible(true)
    setPreviewImage(file.url)
  }

  const handlePreviewCancel = () => {
    setPreviewVisible(false)
  }

  const handleTagChange = (value: any, e) => {
    const tags_id = e.map((item: any) => item.key)
    setTagsSelect(tags_id)
  }
  
  const handleCategoriesChange = (value: any, e) => {
    const category_id = e.map((item: any) => item.key)
    setCategorySelect(category_id)
  }

  const handleEquipmentsChange = (value: any, e) => {
    const quipment_id = e.map((item: any) => item.key)
    setEquipmentsSelect(quipment_id)
  }

  const getModalContent = () => {
    if (done) {
      return (
        <Result
          status="success"
          title="操作成功"
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      );
    }



    return (
      <div className={styles.photoModelContent}>
        { type == 0 ? <></> : <div className={styles.modelImage}>{getImageList()}</div>}
        <div className={styles.modelFormContainer}>
          <Form
            form={form}
            {...formItemLayout}
            size='large'
            onFinish={handleFinish}
          >
            <Form.Item
              name='name'
              label='照片名'
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name='des'
              label='描述'
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name='location'
              label='拍摄地'
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name='shooting_date'
              label='拍摄日期'
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name='aperture'
              label='光圈'
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name='focal_length'
              label='焦段'
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name='shutter'
              label='快门'
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name='iso'
              label='iso'
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label='标签'
            >
              <Select
                // labelInValue
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Please select"
                defaultValue={current?.tags?.map(item => item.name)}
                onChange={handleTagChange}
              >
                {
                  tagsResults.map((item: any) => {
                    return <Option key={item.id} value={item.tag_name}>{item.tag_name}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item
              label='分类'
            >
              <Select
                // labelInValue
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Please select"
                defaultValue={current?.categories?.map(item => item.category_name)}
                onChange={handleCategoriesChange}
              >
                {
                  categoryResults.map((item: any) => {
                    return <Option key={item.id} value={item.category_name}>{item.category_name}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item
              label='设备'
            >
              <Select
                // labelInValue
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Please select"
                defaultValue={current?.equipments?.map(item => item.name)}
                onChange={handleEquipmentsChange}
              >
                {
                  equipmentsResults.map((item: any) => {
                    console.log('equipmentsResults: ', item)
                    return <Option key={item.id} value={item.name}>{item.name}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }

  const showPreviewModel = () => {
    if (type == 0) {
      return <></>
    } else if (type == 1) {
      return (
        <Modal
          destroyOnClose
          visible={previewVisible}
          onCancel={handlePreviewCancel}
          footer={null}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      )
    } else {
      return <></>
    }
  }

  return (
    <div>
      <Modal
        destroyOnClose={destroyOnClose}
        title={type == 0 ? '新增照片信息' : '编辑照片信息'}
        visible={visible}
        // onOk={handleOk}
        width={1000}
        // getContainer={false}
        {...modalFooter}
      >
        {getModalContent()}
      </Modal>
      {showPreviewModel()}
    </div>
  )
}

export default connect(
  ({
    photoList
  }: {
    photoList: StateType;
  }) => ({
    photoList
  })
)(PhotoModel)
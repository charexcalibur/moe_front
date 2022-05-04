/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-02-16 22:41:51
 * @LastEditors: hayato
 * @LastEditTime: 2022-05-04 23:07:13
 */
import React, { FC, useState, useEffect } from 'react'
import { Modal, Form, Button, Input, Result, Upload, message, Select, Card } from 'antd'
import { Dispatch } from 'redux'
import { connect } from 'dva'
import styles from '../style.less'
import { PhotoListItemType, StateType } from '../data'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import * as qiniu from 'qiniu-js'
import { getQiniuToken } from '@/pages/list/basic-list/service'
import prefixUrl from './../../../../prefix'
import { deleteImageSizes } from '@/pages/photo/service'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const QINIU_SERVER = prefixUrl.QINIU_SERVER
const CDN_URL = prefixUrl.CDN_URL

const { Option } = Select

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
  const [loading, setLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageName, setImageName] = useState<string>('')
  // const [fileList, setFileList] = useState<any[]>([])

  useEffect(() => {
    if (form && !visible) {
      console.log('reset fields')
      form.resetFields();
    }
  }, [props.visible])

  useEffect(() => {
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

  const modalFooter = { okText: '保存', onOk: handleSubmit, onCancel }

  // const uploadButton = (
  //   <div>
  //     {loading ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </div>
  // );

  const handleChange = ({ file, fileList }: {
    file: any,
    fileList: any
  }) => {
    console.log('file: ', file)
    console.log('fileList: ', fileList)
    if (file.status === 'uploading') {
      setLoading(true)
      return;
    }

    if (file.status === 'done') {
      const { uid, name, type, thumbUrl, status, response = {} } = file;
      const fileItem = {
        uid,
        name,
        type,
        thumbUrl,
        status,
        url: (CDN_URL + response.key || "")
      };
      console.log('fileItem: ', fileItem)
      fileList.pop();
      fileList.push(fileItem)
      // setFileList([...fileList])
      setLoading(false)
      console.log('fileItem.url: ', fileItem.url)
      setImageUrl(fileItem.url)
    }
  }

  const handleRemove = async (file: any) => {
    console.log('handle remove: ', file)
    await deleteImageSizes({id: file.id})
    onCancel()
  }

  const getImageList = () => {
    console.log('getImageList current: ', current)
    const imageSize = [
      {
        width: '',
        height: '',
        cdn_url: '',
        type: 2,
        image: 0,
      }
    ]
    if (current?.image_sizes?.length === 0) {
      return (
          <Card
          // style={{ width: 300 }}
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Upload
            name="file"
            listType="picture-card"
            // fileList={fileList}
            action={QINIU_SERVER}
            data={async () => {
              console.log('Upload: ', imageName)
              const res = await getQiniuToken({
                name: imageName,
                prefix: 'wallpaper'
              })
              return {
                token: res.token,
                key: res.key
              }

            }}
            onPreview={handlePreview}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {uploadButton}
          </Upload>
        </Card>
      )
    }
    const fileList = !current ? [] : current?.image_sizes.map(item => {
      return {
        id: item.id,
        uid: item.uid,
        url: item.cdn_url,
        name: current.name === undefined ? '' : current.name,
        size: 0,
        type: ''
      }
    })
    console.log('fileList: ', fileList)
    return (
      <div>
        <Upload
          name="file"
          listType="picture-card"
          fileList={fileList}
          action={QINIU_SERVER}
          data={async () => {
            const res = await getQiniuToken({
              name: 'ceshi',
              prefix: 'wallpaper'
            })
            return {
              token: res.token,
              key: res.key
            }

          }}
          onPreview={handlePreview}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onRemove={handleRemove}
        >
          {fileList.length >= 2 ? null : uploadButton}
        </Upload>
      </div>
    )
  }

  const beforeUpload = (file: any) => {
    console.log('beforeUpload: ')
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Image must smaller than 10MB!');
    }
    return isJpgOrPng && isLt10M;
  }

  const handlePreview = (file: any) => {
    console.log('handle preview: ', file)
    setPreviewVisible(true)
    setPreviewImage(file.url)
  }

  const handlePreviewCancel = () => {
    setPreviewVisible(false)
  }

  const handleTagChange = (value: any, e: any) => {
    const tags_id = e.map((item: any) => item.key)
    setTagsSelect(tags_id)
  }

  const handleCategoriesChange = (value: any, e: any) => {
    const category_id = e.map((item: any) => item.key)
    setCategorySelect(category_id)
  }

  const handleEquipmentsChange = (value: any, e: any) => {
    const quipment_id = e.map((item: any) => item.key)
    setEquipmentsSelect(quipment_id)
  }

  const getModalContent = () => {


    return (
      <div className={styles.photoModelContent}>
        {/* { type == 0 ? <></> : <div className={styles.modelImage}>{getImageList()}</div>} */}
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
              name='rate'
              label='rate'
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
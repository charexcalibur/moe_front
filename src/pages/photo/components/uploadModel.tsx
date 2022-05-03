/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-04-30 18:00:40
 * @LastEditors: hayato
 * @LastEditTime: 2022-04-30 20:06:37
 */
/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-02-16 22:41:51
 * @LastEditors: hayato
 * @LastEditTime: 2022-04-30 17:57:52
 */
import React, { FC, useState, useEffect } from 'react'
import { Modal, Form, Button, Input, Result, Upload, message, Select, Card } from 'antd'
import { Dispatch } from 'redux'
import styles from '../style.less'
import { PhotoListItemType, StateType } from '../data'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import * as qiniu from 'qiniu-js'
import { getQiniuToken } from '@/pages/list/basic-list/service'
import prefixUrl from './../../../../prefix'
import { createImageSizes, patchImageSizes } from '@/pages/photo/service'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const QINIU_SERVER = prefixUrl.QINIU_SERVER
const CDN_URL = prefixUrl.CDN_URL

interface PhotoModelProps {
  done?: boolean;
  visible: boolean;
  current: Partial<PhotoListItemType> | undefined;
  onDone: () => void;
  onCancel: () => void;
  destroyOnClose: boolean;
  type: number;
  photoList: any;
  imageType: number;
}

const UploadModel: FC<PhotoModelProps> = props => {
  const [form] = Form.useForm();
  console.log('props: ', props)
  const {
    done,
    destroyOnClose,
    visible,
    onCancel,
    current,
    imageType
  } = props


  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState(undefined)
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
    console.log('current: ', current)
    if (current) {
      form.setFieldsValue({
        ...current
      })
    }
  }, [props.current])


  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 32 }
  }

  const handleSubmit = () => {
    if (!form) return
    form.submit()
  }

  const handleFinish = async (value: any) => {
    // onSubmit(value)
    console.log('handleFinish value: ', value)
    value.id = current.id
    await patchImageSizes(value)
    message.success('操作成功')
    onCancel()
  }

  const modalFooter = !visible
    ? { footer: null, onCancel: onCancel }
    : { okText: '保存', onOk: handleSubmit, onCancel }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
      form.setFieldsValue({
        cdn_url: fileItem.url
      })
      console.log('fileItem: ', fileItem)
      fileList.pop();
      fileList.push(fileItem)
      // setFileList([...fileList])
      setLoading(false)
      console.log('fileItem.url: ', fileItem.url)
      setImageUrl(fileItem.url)
    }
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
    if (current?.cdn_url?.length === 0) {
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
                name: current.uid,
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

    return (
      <div>
        <Upload
          name="file"
          listType="picture-card"
          // fileList={fileList}
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
        >
          {uploadButton}
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
        {<div className={styles.modelImage}>{getImageList()}</div>}
        <div className={styles.modelFormContainer}>
          <Form
            form={form}
            {...formItemLayout}
            size='large'
            onFinish={handleFinish}
          >
            <Form.Item
              name='width'
              label='宽度'
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name='height'
              label='高度'
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name='cdn_url'
              label='照片地址'
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }

  const showPreviewModel = () => {
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
  }

  return (
    <div>
      <Modal
        destroyOnClose={destroyOnClose}
        title='上传照片'
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

export default UploadModel
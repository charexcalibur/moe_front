/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-04-30 18:00:40
 * @LastEditors: hayato
 * @LastEditTime: 2022-06-20 23:22:51
 */
/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-02-16 22:41:51
 * @LastEditors: hayato
 * @LastEditTime: 2022-04-30 17:57:52
 */
import React, { FC, useState, useEffect } from 'react'
import { Modal, Form, Button, Input, Result, Upload, message, Card } from 'antd'
import styles from '../style.less'
import { PhotoListItemType } from '../data'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import * as qiniu from 'qiniu-js'
import { getQiniuToken } from '@/pages/list/basic-list/service'
import prefixUrl from './../../../../prefix'
import { patchImageSizes, patchPhotoInfo } from '@/pages/photo/service'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { deleteImageSizes } from '@/pages/photo/service'
import Exif from 'exif-js'
import rgbaster from 'rgbaster'

const QINIU_SERVER = prefixUrl.QINIU_SERVER
const CDN_URL = prefixUrl.CDN_URL

interface PhotoModelProps {
  done?: boolean;
  visible: boolean;
  current: Partial<PhotoListItemType> | undefined;
  onCancel: () => void;
  destroyOnClose: boolean;
  imageType: number;
  shouldPatchInfo: boolean;
}

const UploadModel: FC<PhotoModelProps> = props => {
  const [form] = Form.useForm();
  console.log('UploadModel props: ', props)
  const {
    done,
    destroyOnClose,
    visible,
    onCancel,
    current,
    imageType,
    shouldPatchInfo
  } = props


  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageName, setImageName] = useState<string>('')
  const [photoInfo, setPhotoInfo] = useState<any>({})

  useEffect(() => {
    if (form && !visible) {
      console.log('reset fields')
      form.resetFields();
    }
  }, [props.visible])

  useEffect(() => {
    console.log('current: ', current)
    async function getImageColor(url:string) {
      return await rgbaster(url, {
        exclude: [ 'rgb(255,255,255)' , 'rgb(0,0,0)']
      })
    }
    if (!current?.color_range && current.cdn_url) {
      const colorRes = getImageColor(current.cdn_url)
      colorRes.then(res => {
        current.color_range = JSON.stringify(res.slice(0, 11))
        form.setFieldsValue({
          ...current
        })
      })

    } else {
      setTimeout(() => {
        form.setFieldsValue({
          ...current
        })
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
    if (shouldPatchInfo) {
      const infoParams = {id: current.image, ...photoInfo}
      await patchPhotoInfo(infoParams)
    }

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

  const handleChange = async ({ file, fileList }: {
    file: any,
    fileList: any
  }) => {
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
      // 获取主色值
      const colorRes = await rgbaster(fileItem.url, {
        exclude: [ 'rgb(255,255,255)' , 'rgb(0,0,0)']
      })

      form.setFieldsValue({
        cdn_url: fileItem.url,
        color_range: JSON.stringify(colorRes.slice(0, 11))
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
            onRemove={handleRemove}
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
    console.log('beforeUpload: ', file)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', (event: any) => {
      const _loadedImageUrl = event.target.result;
      const image = document.createElement('img');
      image.src = _loadedImageUrl;
      image.addEventListener('load', () => {
        const { width, height } = image;
        // set image width and height to your state here
        console.log(width, height);
        form.setFieldsValue({
          width,
          height
        })
      });
    });


    Exif.getData(file, function() {
      const dateList = Exif.getTag(this, 'DateTimeOriginal').split(' ')[0].split(':')

      const imageInfo = {
        iso: Exif.getTag(this, 'ISOSpeedRatings'),
        aperture: `F ${Exif.getTag(this, 'FNumber')}`,
        shutter: `${Exif.getTag(this, 'ExposureTime').numerator}/${Exif.getTag(this, 'ExposureTime').denominator}`,
        focal_length: `${Exif.getTag(this, 'FocalLength').numerator/Exif.getTag(this, 'FocalLength').denominator} mm`,
        shooting_date: `${dateList[0]}年${dateList[1]}月${dateList[2]}日`

      }

      setPhotoInfo(imageInfo)
    })

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
            <Form.Item
              name='color_range'
              label='色值区间'
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
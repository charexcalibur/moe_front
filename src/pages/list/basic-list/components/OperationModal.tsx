import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import { Store } from 'rc-field-form/lib/interface';
import { Modal, Result, Button, Form, Input, Upload, message } from 'antd';
import { BasicListItemDataType } from '../data.d';
import styles from '../style.less';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { any } from 'prop-types';
import * as qiniu from 'qiniu-js'

interface OperationModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => void;
  onCancel: () => void;
  dispatch: Dispatch<any>;
  listAndbasicList: StateType;
}

const { TextArea } = Input;
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};

const QINIU_SERVER = 'https://upload.qiniup.com'
const CDN_URL = 'https://cdn.axis-studio.org/'

const OperationModal: FC<OperationModalProps> = props => {
  console.log('props: ', props)
  const [form] = Form.useForm();
  const {
    done,
    visible,
    current,
    listAndbasicList: {qiniuToken, key},
    onDone,
    onCancel,
    onSubmit,
    dispatch
  } = props;


  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  useEffect(() => {
    console.log('current: ', current)
    if (current) {
      form.setFieldsValue({
        ...current,
        createdAt: current.createdAt ? moment(current.createdAt) : null,
      });
    }
  }, [props.current]);

  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'listAndbasicList/getQiniuToken'
      })
    }
  }, [props.visible])


  const handleSubmit = () => {
    if (!form) return;
    form.submit();
    setImageUrl('')
  };

  const handleFinish = (values: Store) => {
    if (onSubmit) {
      onSubmit(values as BasicListItemDataType);
      setImageUrl('')
    }
  };

  const modalFooter = done
    ? { footer: null, onCancel: onDone }
    : { okText: '保存', onOk: handleSubmit, onCancel };

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
        fileList.push(fileItem);
        setFileList([...fileList]);
        setLoading(false)
        console.log('fileItem.url: ', fileItem.url)
        form.setFieldsValue({
          image_url: fileItem.url
        })
        setImageUrl(fileItem.url)
      }
    }

    const upLoad = (
      <Upload
        name="file"
        listType="picture-card"
        className={styles.quoImageUploader}
        beforeUpload={beforeUpload}
        showUploadList={false}
        action={QINIU_SERVER}
        data={{ token: qiniuToken, key }}
        fileList={fileList}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    )

    return (
      <div className={styles.listModelContainer}>
        <div className={styles.uploadContainer}>
          {upLoad}
        </div>
        <Form 
          className={styles.listModalFormContainer}
          {...formLayout}
          form={form} 
          onFinish={handleFinish}
        >
          <Form.Item
            name="author"
            label="作者"
            rules={[{ required: true, message: '请输入作者名称' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ message: '请输入至少一个字符的产品描述！', min: 1 }]}
          >
            <TextArea rows={4} placeholder="请输入至少一个字符" />
          </Form.Item>
          <Form.Item
            name="image_url"
            label="图片链接"
          >
            <Input placeholder="图片链接" disabled/>
          </Form.Item>
        </Form>
      </div>

    );
  };

  return (
    <Modal
      title={done ? null : `内容${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={640}
      bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default connect(
  ({
    listAndbasicList
  }: {
    listAndbasicList: StateType;

  }) => ({
    listAndbasicList
  }),
)(OperationModal);
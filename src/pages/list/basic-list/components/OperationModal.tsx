import React, { FC, useEffect } from 'react';
import moment from 'moment';
import { Store } from 'rc-field-form/lib/interface';
import { Modal, Result, Button, Form, Input } from 'antd';
import { BasicListItemDataType } from '../data.d';
import styles from '../style.less';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';

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
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const OperationModal: FC<OperationModalProps> = props => {
  const [form] = Form.useForm();
  const {
    done,
    visible,
    current,
    listAndbasicList: {qiniuToken},
    onDone,
    onCancel,
    onSubmit,
    dispatch
  } = props;
  console.log('visible: ', visible)
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  useEffect(() => {
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

  console.log('qiniuToken: ', qiniuToken)

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: Store) => {
    if (onSubmit) {
      onSubmit(values as BasicListItemDataType);
    }
  };

  const modalFooter = done
    ? { footer: null, onCancel: onDone }
    : { okText: '保存', onOk: handleSubmit, onCancel };

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
      <Form {...formLayout} form={form} onFinish={handleFinish}>
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
          <Input placeholder="输入图片链接" />
        </Form.Item>
      </Form>
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

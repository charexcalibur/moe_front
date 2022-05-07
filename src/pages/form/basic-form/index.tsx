import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Upload,
  Button,
  Card,
  DatePicker,
  Input,
  Form,
  InputNumber,
  Radio,
  Select,
  Tooltip,
} from 'antd';
import React, { FC, useEffect } from 'react';
import { Store, ValidateErrorEntity } from 'rc-field-form/es/interface';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType } from './model';
import styles from './style.less';
const FormItem = Form.Item;
interface BasicFormProps {
  submitting: boolean;
  formAndbasicForm: StateType;
  dispatch: Dispatch<any>;
}

const BasicForm: FC<BasicFormProps> = (props) => {
  const {
    submitting,
    dispatch,
    formAndbasicForm: { qiniuToken },
  } = props;
  const [form] = Form.useForm();
  const [showPublicUsers, setShowPublicUsers] = React.useState(false);
  useEffect(() => {
    dispatch({
      type: 'formAndbasicForm/getQiniuToken',
    });
  }, []);
  console.log('qiniuToken: ', qiniuToken);
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 7,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
      md: {
        span: 10,
      },
    },
  };
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 10,
        offset: 7,
      },
    },
  };

  const onFinish = (values: Store) => {
    const { dispatch } = props;
    dispatch({
      type: 'formAndbasicForm/submitRegularForm',
      payload: values,
    });
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = (changedValues: Store) => {
    const { publicType } = changedValues;
    if (publicType) setShowPublicUsers(publicType === '2');
  };

  return (
    <PageHeaderWrapper content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。">
      <Card bordered={false}>
        <Form
          hideRequiredMark
          style={{
            marginTop: 8,
          }}
          form={form}
          name="basic"
          initialValues={{
            public: '1',
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        >
          <FormItem
            {...formItemLayout}
            label="标题"
            rules={[
              {
                required: true,
                message: '请输入标题',
              },
            ]}
          >
            <Input placeholder={qiniuToken} />
          </FormItem>
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <Button type="primary" htmlType="submit" loading={submitting}>
              提交
            </Button>
            <Button
              style={{
                marginLeft: 8,
              }}
            >
              保存
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(
  ({
    loading,
    formAndbasicForm,
  }: {
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
    formAndbasicForm: StateType;
  }) => ({
    formAndbasicForm,
    submitting: loading.effects['formAndbasicForm/submitRegularForm'],
  }),
)(BasicForm);

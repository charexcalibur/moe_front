import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Popover, Row, Select, TimePicker } from 'antd';
import { Store, ValidateErrorEntity, InternalNamePath } from 'rc-field-form/es/interface';

import React, { FC, useState } from 'react';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import TableForm from './components/TableForm';
import FooterToolbar from './components/FooterToolbar';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const fieldLabels = {
  username: '用户名',
  nickname: '用户昵称',
  name: '姓名',
  mobile: '手机号',
  email: '邮箱',
  is_active: '是否激活',
  roles: '角色',
  department: '组织',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型',
};

const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park',
  },
];

interface AdvancedFormProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
}

interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}

const AdvancedForm: FC<AdvancedFormProps> = ({ submitting, dispatch }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState<ErrorField[]>([]);
  const getErrorInfo = (errors: ErrorField[]) => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map(err => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0] as string;
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };

  const onFinish = (values: Store) => {
    setError([]);
    dispatch({
      type: 'formAndadvancedForm/submitAdvancedForm',
      payload: values,
    });
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    console.log('Failed:', errorInfo);
    setError(errorInfo.errorFields);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      hideRequiredMark
      initialValues={{ members: tableData }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <PageHeaderWrapper content="高级表单常见于一次性输入和提交大批量数据的场景。">
        <Card title="仓库管理" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.username}
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={fieldLabels.nickname}
                name="nickname"
                rules={[{ required: true, message: '请输入用户昵称' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  placeholder="用户昵称"
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item
                label={fieldLabels.name}
                name="name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  placeholder="请输入姓名"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.mobile}
                name="mobile"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  placeholder="请输入手机号"
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={fieldLabels.email}
                name="email"
                rules={[{ required: true, message: '请输入邮箱' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  placeholder="请输入邮箱"
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item
                label={fieldLabels.is_active}
                name="is_active"
                rules={[{ required: true, message: '是否激活' }]}
              >
                <Select placeholder="是否激活">
                  <Option value="private">激活</Option>
                  <Option value="public">否</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="任务管理" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.name2}
                name="name2"
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={fieldLabels.url2}
                name="url2"
                rules={[{ required: true, message: '请选择' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item
                label={fieldLabels.owner2}
                name="owner2"
                rules={[{ required: true, message: '请选择管理员' }]}
              >
                <Select placeholder="请选择管理员">
                  <Option value="xiao">付晓晓</Option>
                  <Option value="mao">周毛毛</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.approver2}
                name="approver2"
                rules={[{ required: true, message: '请选择审批员' }]}
              >
                <Select placeholder="请选择审批员">
                  <Option value="xiao">付晓晓</Option>
                  <Option value="mao">周毛毛</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={fieldLabels.dateRange2}
                name="dateRange2"
                rules={[{ required: true, message: '请输入' }]}
              >
                <TimePicker
                  placeholder="提醒时间"
                  style={{ width: '100%' }}
                  getPopupContainer={trigger => {
                    if (trigger && trigger.parentNode) {
                      return trigger.parentNode as HTMLElement;
                    }
                    return trigger;
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item
                label={fieldLabels.type2}
                name="type2"
                rules={[{ required: true, message: '请选择仓库类型' }]}
              >
                <Select placeholder="请选择仓库类型">
                  <Option value="private">私密</Option>
                  <Option value="public">公开</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="成员管理" bordered={false}>
          <Form.Item name="members">
            <TableForm />
          </Form.Item>
        </Card>
      </PageHeaderWrapper>
      <FooterToolbar>
        {getErrorInfo(error)}
        <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
          提交
        </Button>
      </FooterToolbar>
    </Form>
  );
};

export default connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['formAndadvancedForm/submitAdvancedForm'],
}))(AdvancedForm);

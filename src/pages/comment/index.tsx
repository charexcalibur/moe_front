import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
// import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Menu, Space, Tag } from 'antd';
import React, { useRef } from 'react'
import { queryCommentsList, patchCommentInfo } from './api'

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};


const columns: ProColumns<GithubIssueItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '评论人',
    dataIndex: 'name',
    copyable: true,
    ellipsis: true,
    tip: '评论人过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '评论',
    dataIndex: 'comment',
    copyable: true,
    ellipsis: true,
    tip: '评论过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'verify_status',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '已审核',
        status: 1,
      },
      closed: {
        text: '未审核',
        status: 0,
        disabled: true,
      }
    },
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'add_time',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <Button
        key='pass'
        disabled={record.verify_status === 1}
        type='primary'
        onClick={ async () => {
          console.log('click record: ', record)
          const params = {
            id: record.id,
            verify_status: 1
          }
          const res = await patchCommentInfo(params)
          console.log('res: ', res)
          if (res) {
            action.reload()
          }
        }}
      >
        通过
      </Button>,
      <Button
        key='reject'
        type='primary'
        disabled={record.verify_status === 0}
        danger
        onClick={ async () => {
          console.log('click record: ', record)
          const params = {
            id: record.id,
            verify_status: 0
          }
          const res = await patchCommentInfo(params)
          console.log('res: ', res)
          if (res) {
            action.reload()
          }
        }}
      >
        驳回
      </Button>,
    ],
  },
];


export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      params={{
        ordering: '-add_time',
      }}
      request={async (params, sort, filter) => {
        console.log(sort, filter);
        console.log('params: ', params);
        const res = await queryCommentsList({
          limit: params.pageSize,
          page: params.current,
          ordering: params.ordering,
        })
        console.log(res);
        return {
          data: res.results,
          success: true,
          total: res.count,
        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 10,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
    />
  );
};
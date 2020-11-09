/* eslint-disable @typescript-eslint/camelcase */
import React, { FC, useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Input,
  List,
  Radio,
  Modal,
  Dropdown,
  Menu
} from 'antd';

import { findDOMNode } from 'react-dom';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import { StateType } from './model';
import { BasicListItemDataType } from './data.d';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

interface BasicListProps {
  listAndbasicList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

// const Info: FC<{
//   title: React.ReactNode;
//   value: React.ReactNode;
//   bordered?: boolean;
// }> = ({ title, value, bordered }) => (
//   <div className={styles.headerInfo}>
//     <span>{title}</span>
//     <p>{value}</p>
//     {bordered && <em />}
//   </div>
// );

const ListContent = ({
  data: { author, add_time, content },
}: {
  data: BasicListItemDataType;
}) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>作者</span>
      <p>{author}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>开始时间</span>
      <p>{moment(add_time).format('YYYY/MM/DD HH:mm:ss')}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>内容</span>
      <p>{content}</p>
    </div>
  </div>
);

export const BasicList: FC<BasicListProps> = props => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    listAndbasicList: { list, total },
  } = props;
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<BasicListItemDataType> | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [searchWords, setSearchWords] = useState<string>('')
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    dispatch({
      type: 'listAndbasicList/fetch',
      payload: {
        limit: 10,
        page,
        ordering: '-add_time'
      },
    });
  }, [1]);

  const handleSearch = (_searchWords: string) => {
    _searchWords = window.btoa(unescape(encodeURIComponent(_searchWords)))
    dispatch({
      type: 'listAndbasicList/fetch',
      payload: {
        search: _searchWords,
        limit,
        page: 1,
        ordering: '-add_time'
      },
    });
    setSearchWords(_searchWords)
  }

  const handlePageChange = (_page: number) => {
    let payload = {}
    if(searchWords) {
      payload = {
        limit,
        page: _page,
        ordering: '-add_time',
        search: searchWords
      }
    } else {
      payload = {
        limit,
        page: _page,
        ordering: '-add_time'
      }
    }
    dispatch({
      type: 'listAndbasicList/fetch',
      payload
    });
    setPage(_page)
  }

  const handlePageSizeChange = (pageSize: number) => {
    let payload = {}
    if(searchWords) {
      payload = {
        limit: pageSize,
        page,
        ordering: '-add_time',
        search: searchWords
      }
    } else {
      payload = {
        limit: pageSize,
        page,
        ordering: '-add_time'
      }
    }
    dispatch({
      type: 'listAndbasicList/fetch',
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
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: BasicListItemDataType) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (id: string) => {
    dispatch({
      type: 'listAndbasicList/delete',
      payload: {
        id,
        page,
        limit,
        ordering: '-add_time'
      },
    });
  };

  const editAndDelete = (key: string, currentItem: BasicListItemDataType) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除条目',
        content: '确定删除该条目吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteItem(currentItem.id),
      });
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all">
        <RadioButton value="all">全部</RadioButton>
        <RadioButton value="progress">进行中</RadioButton>
        <RadioButton value="waiting">等待中</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={handleSearch} />
    </div>
  );

  const MoreBtn: React.FC<{
    item: BasicListItemDataType;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key+'', item)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多
      </a>
    </Dropdown>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    dispatch({
      type: 'listAndbasicList/fetch',
      payload: {
        limit,
        page,
        ordering: '-add_time'
      },
    });
    setAddBtnblur();
    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values: BasicListItemDataType) => {

    if (current?.id) {
      values.id = current.id
      dispatch({
        type: 'listAndbasicList/edit',
        payload: {...values},
      });
    } else {
      dispatch({
        type: 'listAndbasicList/submit',
        payload: {...values},
      });
    }
    setAddBtnblur();
    setDone(true);
    setCurrent(undefined)
  };

  return (
    <div>
      <PageHeaderWrapper>
        <div className={styles.standardList}>

          <Card
            className={styles.listCard}
            bordered={false}
            title="基本列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined />
              添加
            </Button>

            <List
              size="small"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={e => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  {/* <List.Item.Meta
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.subDescription}
                  /> */}
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>

      <OperationModal
        done={done}
        current={current}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default connect(
  ({
    listAndbasicList,
    loading,
  }: {
    listAndbasicList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    listAndbasicList,
    loading: loading.models.listAndbasicList,
  }),
)(BasicList);

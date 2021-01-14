/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 17:36:19
 * @LastEditors: hayato
 * @LastEditTime: 2021-01-14 22:53:34
 */
/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
  SettingDrawer,
} from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { useEffect } from 'react';
import { Link, router } from 'umi';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { GithubOutlined, DashboardFilled, TableOutlined, FundOutlined, UnorderedListOutlined} from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';
import { any } from 'prop-types';


const iconsEnum = {
  table: <TableOutlined />,
  dashboard: <FundOutlined />
}

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

const footerRender: BasicLayoutProps['footerRender'] = () => {
  return (
    <>
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    dispatch,
    children,
    settings,
    menuData,
    loading,
    location = {
      pathname: '/',
    },
  } = props;

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'menu/getMenuData',
      });
    }
  }, []);

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };

  const mappingIcon = (menuData: MenuDataItem[]): MenuDataItem[] => {
    const mappingMenu = menuData.map(item => ({
      ...item,
      icon: iconsEnum[item.icon],
      children: item.children ? mappingIcon(item.children) : [],
    }));
    return mappingMenu;
  };

  const _menuData = menuData !== undefined ? mappingIcon(menuData) : []

  const checkMenuAccess = (menuItem: MenuDataItem): any => {
    if(menuItem.children) {
      menuItem.children.forEach((item) => {
        return checkMenuAccess(item)
      })
    } else {
      return menuItem.path === window.location.pathname
    }
  }


  if(!loading && loading !== undefined && menuData !== undefined) {
    const pathAccess = menuData.find((item) => {
      if(window.location.pathname === '/404') {
        return true
      }
      return checkMenuAccess(item)
    })

    if(!pathAccess && pathAccess !== undefined) {
      router.push('/404')
    }
  }

  return (
    <>
      <ProLayout
        logo={logo}
        formatMessage={formatMessage}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/">
            {logoDom}
            {titleDom}
          </Link>
        )}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '首页',
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={footerRender}
        menuDataRender={() => _menuData}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
    </>
  );
};

export default connect(({ global, settings, menu, loading }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  menuData: menu.menuData,
  loading: loading.models.menu,
}))(BasicLayout);

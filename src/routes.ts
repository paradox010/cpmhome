import { IRouterConfig, lazy } from 'ice';
import Layout from '@/Layouts/BasicLayout';
import BLayout from '@/Layouts/BlankLayout';
// import { SmileOutlined, HeartOutlined } from '@ant-design/icons';
import React from 'react';

const Home = lazy(() => import('@/pages/Home'));
const Search = lazy(() => import('@/pages/Search'));
const Cpm = lazy(() => import('@/pages/Cpm'));
const Certification = lazy(() => import('@/pages/Certification'));
const Login = lazy(() => import('@/pages/User/Login'));

const NotFound = lazy(() => import('@/components/NotFound'));

interface DRouterConfig extends IRouterConfig {
  menuConfig?: {
    name?: string;
    hideMenu?: boolean;
    icon?: React.ComponentType<any>;
  };
  children?: DRouterConfig[];
}

const routerConfig: DRouterConfig[] = [
  // {
  //   path: '/user',
  //   component: BLayout,
  //   children: [
  //     {
  //       path: '/login',
  //       component: Login,
  //       menuConfig: {
  //         name: '登陆',
  //       },
  //     },
  //   ],
  // },
  {
    path: '/',
    component: Layout,
    pageConfig: {
      title: '浙江省工业产品主数据管理平台',
    },
    children: [
      {
        path: '/home',
        menuConfig: {
          name: '首页',
        },
        component: Home,
      },
      {
        path: '/search',
        menuConfig: {
          name: '搜索',
        },
        component: Search,
      },
      {
        path: '/detail',
        menuConfig: {
          name: '标准详情',
        },
        component: Cpm,
      },
      {
        path: '/certification',
        menuConfig: {
          name: '认证',
        },
        component: Certification,
      },
      {
        path: '/',
        redirect: '/home',
      },
      {
        component: NotFound,
      },
    ],
  },
];

export default routerConfig;
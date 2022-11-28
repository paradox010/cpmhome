import { createElement } from 'react';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import { Link } from 'ice';
import { asideMenuConfig } from './menuConfig';
import { Avatar } from 'antd';

import styles from './index.module.less';

const footerLinks = [
  {
    name: '道生产业互联中心',
  },
  {
    name: '浙江工业200',
  },
  {
    name: '产业大脑能力中心',
  },
  {
    name: '产品码',
  },
  {
    name: '产业链一链通',
  },
];
const loopMenuItem = (menus) =>
  menus.map(({ icon, children, ...item }) => ({
    ...item,
    icon: createElement(icon),
    children: children && loopMenuItem(children),
  }));

export default function BasicLayout({ children, location }) {
  return (
    <ProLayout
      title="浙江省工业产品主数据管理平台"
      style={{
        minHeight: '100vh',
      }}
      layout="top"
      location={{
        pathname: location.pathname,
      }}
      className={styles.bLayout}
      navTheme="light"
      contentStyle={{ margin: 0 }}
      menuDataRender={() => loopMenuItem(asideMenuConfig)}
      menuItemRender={(item, defaultDom) => {
        if (!item.path) {
          return defaultDom;
        }
        return <Link to={item.path}>{defaultDom}</Link>;
      }}
      logo={false}
      rightContentRender={() => <Avatar shape="square" size="small" />}
      footerRender={() => (
        <div className={styles.footer}>
          <div className={styles.footerLinks}>
            {footerLinks.map((v) => (
              <div key={v.name}>{v.name}</div>
            ))}
          </div>
        </div>
      )}
    >
      {children}
    </ProLayout>
  );
}

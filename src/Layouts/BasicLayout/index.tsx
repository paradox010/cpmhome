import { createElement } from 'react';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import { Link } from 'ice';
import { asideMenuConfig } from './menuConfig';
import { Avatar, Image } from 'antd';
import { SmileOutlined, IdcardOutlined, UserOutlined } from '@ant-design/icons';

import AvatarDropDown from '@/components/HeaderDropDown/AvatarDropDown';

import styles from './index.module.less';

const footerLinks = [
  {
    title: '友情链接',
    links: [
      {
        title: '中国产品主数据标准服务平台',
        url: 'https://www.cpms.org.cn',
      },
    ],
  },
  {
    title: '指导单位',
    links: [
      {
        title: '浙江省经济和信息化厅',
        url: 'http://jxt.zj.gov.cn/',
      },
      {
        title: '中国电子技术标准化研究院',
        url: 'http://www.cesi.cn/page/index.html',
      },
    ],
  },
  {
    title: '主办单位',
    links: [
      {
        title: '浙江省数字经济发展中心',
        url: 'http://www.zqa.org.cn/',
      },
    ],
  },
  {
    title: '技术支持单位',
    links: [
      {
        title: '杭州道生产业互联网有限公司',
      },
      {
        title: '浙江移动信息系统集成有限公司',
      },
    ],
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
      menuHeaderRender={(logo, title) => <a href="/">{title}</a>}
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
      menuDataRender={() => [
        {
          name: '专家申报',
          path: '/certification',
          icon: <IdcardOutlined style={{ fontSize: 20, verticalAlign: -5 }} />,
        },
      ]}
      menuItemRender={(item, defaultDom) => {
        if (!item.path) {
          return defaultDom;
        }
        return <Link to={item.path}>{defaultDom}</Link>;
      }}
      logo={false}
      rightContentRender={() => (
        <AvatarDropDown />
      )}
      footerRender={() => (
        <div className={styles.footer}>
          <div className={styles.footerLinks}>
            {footerLinks?.map((v) => (
              <div className={styles.column} key={v.title}>
                <h2>{v.title}</h2>
                {v.links?.map((u) => (
                  <div className={styles.item} key={u.title}>
                    {u.url ? (
                      <a href={u.url} target="_blank" rel="noreferrer">
                        {u.title}
                      </a>
                    ) : (
                      u.title
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    >
      {children}
    </ProLayout>
  );
}

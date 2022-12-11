import { useRequest } from 'ahooks';
import { history, Link, request } from 'ice';

import { getParams, appendSearch } from '@/utils/location';

import styles from './index.module.less';
import { Breadcrumb, Button, Descriptions, Select } from 'antd';
import store from '@/store';

async function getTree() {
  const resData = await request({
    url: `/api/home/domainRelease/info?domainId=${getParams()?.domainId}`,
  });
  return resData;
}
const Abstract = () => {
  const [user] = store.useModel('user');
  const { data } = useRequest(getTree);
  const goDetail = () => {
    history?.push(`/detail${appendSearch()}`);
  };
  return (
    <div className={styles.main}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/home">首页</Link>
        </Breadcrumb.Item>
        {!getParams()?.noSearch && (
          <Breadcrumb.Item>
            <Link to="/search">搜索</Link>
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item>摘要</Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.content}>
        <div className={styles.headerTitle}>
          {data?.domain?.name}
          <Select
            value={`V${data?.domain?.version || ''}`}
            options={[
              {
                label: `V${data?.domain?.version || ''}`,
                value: `V${data?.domain?.version || ''}`,
              },
            ]}
          />
          {user?.userId && (
            <Button onClick={goDetail} type="primary" style={{ float: 'right' }}>
              查看
            </Button>
          )}

          {/* <span className="ds-version">V{data?.domain?.version}</span> */}
        </div>
        <div>
          <div className={styles.desLabel}>发布时间：{data?.domain?.pubDate}</div>
          <div className={styles.desLabel}>制订者：{data?.domain?.teamName || '-'}</div>
          <div className={styles.desLabel}>产品类目：{data?.domain?.categoryCount}</div>
          <div className={styles.desLabel}>产品属性：{data?.domain?.featureCount}</div>
        </div>
        <Descriptions className={styles.descriptions} layout="vertical" bordered style={{ margin: '20px 0' }}>
          <Descriptions.Item label="专家小组">
            <li>
              <span>专家小组组长：</span>
              <span>
                {data?.teamUser
                  ?.filter((v) => v.roleId === '2001')
                  .map((v) => v.userName)
                  .join('；')}
              </span>
            </li>
            <li>
              <span>专家小组成员：</span>
              <span>
                {data?.teamUser
                  ?.filter((v) => v.roleId === '2002')
                  .map((v) => v.userName)
                  .join('；')}
              </span>
            </li>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions className={styles.descriptions} layout="vertical" bordered>
          <Descriptions.Item label="版本信息">
            <li>
              <span>版本贡献专家：</span>
              <span>{data?.versionExpert?.join('；')}</span>
            </li>
            <li>
              <span>版本概述：</span>
              <span>{data?.description}</span>
            </li>
            <li>
              <span>版本修订记录：</span>
              <span>{data?.fileUrl ? <a>sdf</a> : '-'}</span>
            </li>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};

export default Abstract;

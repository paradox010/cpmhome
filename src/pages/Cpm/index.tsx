import Panel from './Panel';

import styles from './index.module.less';
import { Breadcrumb } from 'antd';
import Tree from './Tree';
import Attr from './Attr';

import { useRequest } from 'ahooks';
import { request } from 'ice';

import { getParams } from '@/utils/location';

async function getTree() {
  const resData = await request({
    url: `/api/home/productCategoryRelease/getTree?domainId=${getParams()?.domainId}`,
  });
  return resData;
}

export default () => {
  const { data } = useRequest(getTree);
  return (
    <>
      <div className={styles.main}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/">首页</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/search">搜索</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.content}>
          <div className={styles.headerTitle}>
            {data?.domain?.name} V{data?.domain?.version}
          </div>
          <div>
            <div className={styles.desLabel}>发布时间：{data?.domain?.pubDate}</div>
            <div className={styles.desLabel}>制订者：{data?.domain?.teamName}</div>
            <div className={styles.desLabel}>产品类目：{data?.domain?.categoryCount}</div>
            <div className={styles.desLabel}>产品属性：{data?.domain?.featureCount}</div>
          </div>
          <Panel>
            <div className={styles.treeWrap}>
              <Tree data={data?.categoryTree} />
            </div>
            <Attr />
          </Panel>
        </div>
      </div>
    </>
  );
};

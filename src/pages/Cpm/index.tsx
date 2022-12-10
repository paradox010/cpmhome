import Panel from './Panel';

import styles from './index.module.less';
import { Breadcrumb, Select } from 'antd';
import Tree from './Tree';
import Attr from './Attr';

import { useRequest } from 'ahooks';
import { Link, request } from 'ice';

import { appendSearch, getParams } from '@/utils/location';

async function getTree() {
  const resData = await request({
    url: `/api/home/productCategoryRelease/getTree?domainId=${getParams()?.domainId}&categoryId=${
      getParams()?.selected || ''
    }`,
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
            <Link to="/home">首页</Link>
          </Breadcrumb.Item>
          {!getParams()?.noSearch && (
            <Breadcrumb.Item>
              <Link to="/search">搜索</Link>
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item>
            <Link to={`/beforeDetail${appendSearch(location, { selected: '' })}`}>摘要</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.content}>
          <div className={styles.headerTitle}>
            {data?.domain?.name}
            <Select
              size="large"
              value={`V${data?.domain?.version || ''}`}
              options={[
                {
                  label: `V${data?.domain?.version || ''}`,
                  value: `V${data?.domain?.version || ''}`,
                },
              ]}
            />
            {/* <span className="ds-version">V{data?.domain?.version}</span> */}
          </div>
          <div>
            <div className={styles.desLabel}>发布时间：{data?.domain?.pubDate}</div>
            <div className={styles.desLabel}>制订者：{data?.domain?.teamName || '-'}</div>
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

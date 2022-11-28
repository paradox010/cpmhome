import { Tabs, Statistic, List, Affix, Button } from 'antd';
import styles from './index.module.less';
import { history, request } from 'ice';
import Search from '../Search/Search';

import { useRequest } from 'ahooks';
import { useRef } from 'react';
import type { InputRef } from 'antd/lib/input';
import Mesg from './Mesg';
import Stand from './Stand';

async function getStand() {
  const resData = await request({
    url: '/api/home/industryType/listType',
  });
  return resData;
}

export default () => {
  const { data: standData } = useRequest(getStand);

  const onSearch = (value) => {
    history?.push(`/search${value ? `?keywords=${value}` : ''}`);
  };

  const goTo = () => {
    window.open('http://121.37.179.208:8002/', 'target');
  };
  const goStand = (id) => {
    history?.push(`/detail?domainId=${id}`);
  };
  const clickSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSearch(inputRef.current?.input?.value);
  };
  const inputRef = useRef<InputRef>(null);
  return (
    <>
      <div className={styles.search}>
        <div className={styles.searchContent}>
          <div className={styles.title}>浙江省工业产品主数据管理平台</div>
          <div className={styles.subTitle}>让产业触手可及 让互联随时发生</div>
          <div className={styles.inputWrap}>
            <Search
              inputConfig={{
                ref: inputRef,
                addonAfter: (
                  <Button type="primary" onMouseDown={clickSearch}>
                    搜索
                  </Button>
                ),
                size: 'large',
              }}
              onSelect={onSearch}
            />
          </div>
        </div>
      </div>
      <Mesg />
      <div className={styles.indus}>
        <div className={styles.indusContent}>
          <Stand />
          <div className={styles.cardTitle}>标准导航</div>
          <Tabs
            tabPosition={'left'}
            items={standData?.map((v) => ({
              label: v.typeName,
              key: v.typeName,
              children: (
                <List
                  dataSource={v.industryStandard}
                  pagination={{
                    position: 'bottom',
                    size: 'small',
                    pageSize: 12,
                    total: v.industryStandard.length,
                  }}
                  renderItem={(k: any) => (
                    <List.Item
                      onClick={() => goStand(k.domainReleaseId)}
                      style={k.categoryCount ? { cursor: 'pointer' } : { pointerEvents: 'none', cursor: 'not-allowed' }}
                    >
                      <div className={styles.title}>{k.domainName}</div>
                      <div className={styles.subAttr}>
                        <div className={styles.border}>
                          <Statistic title="产品类目" value={k.categoryCount || '-'} />
                        </div>
                        <div>
                          <Statistic title="产品属性" value={k.featureCount || '-'} />
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              ),
            }))}
          />
        </div>
      </div>
      <div className={styles.affix}>
        <Affix offsetTop={110}>
          <div className={styles.linkWrap}>
            <div className={styles.linkItem} onClick={goTo}>
              专家系统
            </div>
            <div className={styles.linkItem}>链商云</div>
          </div>
        </Affix>
      </div>
    </>
  );
};

// <div className={styles.tabContent}>{v.children.map((k,i)=><div className={styles.card}>
//                 <div className={styles.title}>{k.name}</div>
//                 <div className={styles.subAttr}>
//                   <div className={styles.border}>
//                      <Statistic title="产品类目" value={6231} />
//                   </div>
//                   <div>
//                      <Statistic title="属性类目" value={6231} />
//                   </div>
//                 </div>
//               </div>)}
//               </div>

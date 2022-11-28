import { useState } from 'react';
import { Segmented, Badge } from 'antd';
import List from './List';
import { searchEnum } from '@/dataType';
import styles from './index.module.less';

import { useRequest } from 'ahooks';
import { request } from 'ice';

async function getCount(params) {
  const resData = await request({
    url: '/api/home/complexSearch/search/count',
    method: 'post',
    data: params,
  });
  return resData;
}

// 在这里做请求？存储数据
// list只负责绘制，

// filter change => clock should request
// if tab change? 看他有没有change？如何判定tab是否已经发送过请求了

const SearchIndex = ({ filter }) => {
  const [tab, setTab] = useState<string | number>(searchEnum[0].value);

  const { data } = useRequest(() => getCount(filter), {
    refreshDeps: [filter],
  });

  return (
    <div className={styles.content}>
      <div className={styles.segWrap}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={searchEnum.map((v) => ({
            value: v.value,
            label: (
              <>
                <span>{v.label}</span>
                <Badge className="ds-badge" count={data?.[v.value] || 0} overflowCount={999} />
              </>
            ),
          }))}
        />
      </div>
      {searchEnum.map((v) => (
        <div className={styles.listWrap} style={{ display: v.value === tab ? 'block' : 'none' }} key={v.value}>
          <List filter={filter} type={v.value} tab={tab as string} />
        </div>
      ))}
    </div>
  );
};

export default SearchIndex;

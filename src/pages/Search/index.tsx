import { useState } from 'react';
import { Breadcrumb } from 'antd';
import Tabs from './Tabs';
import Filter from './Filter';
import { getParams } from '@/utils/location';

import styles from './index.module.less';
import { Link } from 'ice';

const SearchIndex = () => {
  const [filter, setFilter] = useState({ keywords: getParams().keywords, allType: getParams().allType });

  return (
    <div className={styles.main}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/home">首页</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>搜索</Breadcrumb.Item>
      </Breadcrumb>
      <Filter setFilter={setFilter} />
      <Tabs filter={filter} />
    </div>
  );
};

export default SearchIndex;

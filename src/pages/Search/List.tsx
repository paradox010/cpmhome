import { Checkbox, List } from 'antd';
import { memo, useEffect, useRef, useState } from 'react';
import Card from './Card';

import { useRequest } from 'ahooks';
import { request } from 'ice';

import { getParams } from '@/utils/location';

async function getList(params) {
  const resData = await request({
    url: '/api/home/complexSearch/search',
    method: 'post',
    data: params,
  });
  return resData;
}
const pageSize = 10;

function getInitData(type) {
  const params = getParams();
  params.type = params.type || '0';
  const res: any = {};
  if (params.type !== type) {
    return res;
  }
  if (params.hotSort === 'true') {
    res.hotSort = true;
  }
  if (params.newSort === 'true') {
    res.newSort = true;
  }
  return res;
}
export default memo<{ filter: any; type: string; tab: string }>(({ filter, type, tab }) => {
  const [hotSort, setHotSort] = useState(!!getInitData(type).hotSort);
  const [newSort, setNewSort] = useState(!!getInitData(type).newSort);

  const { data, run } = useRequest(getList, {
    manual: true,
  });

  const shouldRun = useRef<boolean>(true);

  useEffect(() => {
    shouldRun.current = true;
  }, [filter, hotSort, newSort]);

  useEffect(() => {
    if (tab === type && shouldRun.current) {
      run({ ...filter, page: 1, pageSize, type, hotSort, newSort });
      shouldRun.current = false;
    }
  }, [filter, tab, hotSort, newSort]);

  const onPageChange = (page) => {
    run({ ...filter, page, pageSize, type, hotSort, newSort });
  };

  return (
    <>
      <div style={{ padding: '15px 20px' }}>
        <Checkbox checked={hotSort} onChange={(e) => setHotSort(e.target.checked)}>
          热门
        </Checkbox>
        <Checkbox checked={newSort} onChange={(e) => setNewSort(e.target.checked)}>
          最新
        </Checkbox>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={data?.list || []}
        pagination={{
          pageSize,
          total: data?.total > 100 ? 100 : data?.total || 0,
          onChange: onPageChange,
          showSizeChanger: false,
        }}
        rowKey="id"
        loading={false}
        renderItem={(item) => <Card item={item} />}
      />
    </>
  );
});

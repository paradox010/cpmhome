import { useLocation, request } from 'ice';
import { useEffect } from 'react';
import { useRequest } from 'ahooks';
import { parse } from 'qs';

import { Tabs } from 'antd';
import Header from './Header';
import Table from './Table';
import History from './History';

async function getAttr(v) {
  const resData = await request({
    url: `/api/home/productFeatureRelease/getDetail?categoryId=${v}`,
  });
  return resData;
}

export default () => {
  const { data, run } = useRequest(getAttr, {
    manual: true,
  });

  const location = useLocation();
  useEffect(() => {
    if (location.search.split('?').length > 1) {
      const searchParams = parse(location.search.split('?')[1]);
      if (searchParams?.selected && searchParams.selected !== undefined) {
        run(searchParams.selected);
      }
    }
  }, [location]);

  const items = [
    {
      label: '产品属性',
      children: <Table data={data} />,
      key: '产品属性',
    },
    {
      label: '修订历史',
      children: <History data={data} />,
      key: '修订历史',
    },
  ];
  return (
    <>
      <Header data={data?.category || {}} />
      <Tabs items={items} />
    </>
  );
};

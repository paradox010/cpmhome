import { AutoComplete, Input } from 'antd';
import { useRequest } from 'ahooks';
import { request } from 'ice';
import { useEffect } from 'react';

import type { InputProps, InputRef } from 'antd/lib/input';

async function getWords(params = {}) {
  const resData = await request({
    url: '/api/home/complexSearch/history',
    params,
  });
  return resData;
}

const Search: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  inputConfig?: InputProps & React.RefAttributes<InputRef>;
  ifSearch?: boolean;
}> = ({ value, onChange, onSelect, inputConfig, ifSearch }) => {
  const { data, run } = useRequest(getWords, {
    debounceWait: 800,
    manual: true,
  });
  useEffect(() => {
    run();
  }, []);

  const onSearch = (v) => {
    run({ keywords: v });
  };

  return (
    <AutoComplete
      onSearch={onSearch}
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      style={{ width: '100%' }}
      options={data?.map((v) => ({ label: v, value: v } || []))}
    >
      {ifSearch ? (
        <Input.Search placeholder="请输入关键词搜索" {...inputConfig} />
      ) : (
        <Input placeholder="请输入关键词搜索" {...inputConfig} />
      )}
    </AutoComplete>
  );
};
export default Search;

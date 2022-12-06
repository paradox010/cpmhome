// import { AutoComplete, Input } from 'antd';
import { useRequest } from 'ahooks';
import { request } from 'ice';
import SearchComplete from '@/components/SearchComplete';

async function getWords(params) {
  const resData = await request({
    url: '/api/home/productCategoryRelease/search',
    params,
  });
  return resData;
}

const Search: React.FC<{
  id: string;
  onSelect?: (value: string, option: any) => void;
}> = ({ onSelect, id }) => {
  const { data, run } = useRequest(getWords, {
    debounceWait: 400,
    manual: true,
  });

  const onSearch = (v) => {
    run({ keywords: v, domainId: id });
  };
  const tData = data?.map((v) => ({
    label: v.name,
    value: v.id,
  }));

  return (
    <SearchComplete
      style={{ width: '100%', maxWidth: 400, marginRight: 10 }}
      onChange={onSearch}
      onSelect={onSelect}
      options={tData}
      inputWrapStyle={{ width: '100%' }}
    />
    // <AutoComplete
    //   onSearch={onSearch}
    //   onSelect={onSelect}
    //   style={{ width: 300, marginRight: 10 }}
    //   placeholder="请输入关键词搜索"
    //   options={tData || []}
    // >
    //   <Input />
    // </AutoComplete>
  );
};
export default Search;

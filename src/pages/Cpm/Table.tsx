import { useState } from 'react';
import { Radio, Table } from 'antd';
import { attrEnum, attrTypeEnum } from '@/dataType';

const columns = [
  {
    title: '序号',
    dataIndex: '_num',
    key: '_num',
  },
  {
    title: '属性编码',
    dataIndex: 'featureCode',
    key: 'featureCode',
  },
  {
    title: '属性名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '类型',
    dataIndex: 'dataType',
    key: 'dataType',
    render: (text) => attrTypeEnum?.find((v) => v.value === text)?.label,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '编码-值',
    dataIndex: 'value',
    key: 'value',
    render: (text) => text?.split('；')?.map((v, i) => <div key={i}>{v}</div>),
  },
];

const AttrTable = ({ data }) => {
  const [radio, setRadio] = useState('1');
  return (
    <>
      <Radio.Group style={{ marginBottom: 8 }} value={radio} onChange={(e) => setRadio(e.target.value)}>
        {attrEnum.map((v) => (
          <Radio.Button value={v.value} key={v.value}>
            {v.label}
          </Radio.Button>
        ))}
      </Radio.Group>
      <Table
        scroll={{
          y: 'calc(60vh - 40px)',
        }}
        className="attr-60-40"
        pagination={false}
        dataSource={data?.featureInfo?.[radio] || []}
        rowKey="id"
        columns={columns}
        bordered
      />
    </>
  );
};

export default AttrTable;

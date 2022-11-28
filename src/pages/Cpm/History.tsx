import { Table } from 'antd';

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '修订操作',
    dataIndex: 'operation',
    key: 'operation',
  },
  {
    title: '修改内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '修订版本',
    dataIndex: 'domain',
    key: 'domain',
  },
];

const HistoryTable = ({ data }) => {
  return (
    <>
      <Table
        scroll={{
          y: '60vh',
        }}
        pagination={false}
        dataSource={data?.revision || []}
        rowKey="id"
        columns={columns}
        bordered
      />
    </>
  );
};

export default HistoryTable;

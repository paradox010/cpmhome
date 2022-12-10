import { Descriptions } from 'antd';

import styles from './index.module.less';

export default ({ data }) => {
  return (
    <div>
      <div
        style={{
          fontSize: 18,
          padding: '20px 0',
          fontWeight: 500,
        }}
      >
        {data?.categoryCode}
        <span style={{ paddingLeft: 10 }}>{data?.name}</span>
      </div>
      <Descriptions title={false} bordered className={styles.header} size="middle" column={1}>
        <Descriptions.Item label="编码" labelStyle={{ width: 150 }}>
          {data?.categoryCode}
        </Descriptions.Item>
        <Descriptions.Item label="名称" labelStyle={{ width: 150 }}>
          {data?.name}
        </Descriptions.Item>
        <Descriptions.Item label="描述" labelStyle={{ width: 150 }}>
          {data?.description || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="应用实例" labelStyle={{ width: 150 }}>
          此处展示企业产品实例，虚位以待!
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

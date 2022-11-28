import ProForm, { ProFormInstance, ProFormList, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { Badge, Form, Select } from 'antd';
import { useRef, useState } from 'react';
import Search from './Search';
import { searchEnum } from '@/dataType';

import styles from './index.module.less';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { getParams } from '@/utils/location';

export default ({ setFilter }) => {
  const [collapse, setCollapse] = useState(true);
  const formRef = useRef<ProFormInstance<{}>>();

  const onSelect = () => {
    formRef?.current
      ?.validateFields()
      .then((newVal) => {
        setFilter(newVal);
      })
      .catch(() => {});
  };

  return (
    <ProForm<{}>
      formRef={formRef}
      onFinish={async () => {
        const value = await formRef?.current?.validateFields();
        setFilter(value);
      }}
      style={{
        background: '#fff',
        marginTop: 10,
        padding: 20,
      }}
      className={styles.filterForm}
      submitter={{
        searchConfig: {
          submitText: '搜索',
        },
      }}
    >
      <Form.Item name="keywords" initialValue={getParams()?.keywords}>
        <Search onSelect={onSelect} inputConfig={{ onPressEnter: onSelect }} />
      </Form.Item>
      <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
        {(form) => {
          return (
            <div className={styles.searchCollapse}>
              <Badge dot={form.getFieldsValue()?.advance?.length > 0}>高级搜索</Badge>
              {form.getFieldsValue()?.advance?.length > 0 ? (
                <a
                  onClick={() => {
                    setCollapse(!collapse);
                  }}
                >
                  {collapse ? '收起' : '展开'}
                  {collapse ? <UpOutlined /> : <DownOutlined />}
                </a>
              ) : null}
            </div>
          );
        }}
      </Form.Item>
      <ProFormList name="advance" initialValue={[{}]} style={collapse ? { display: 'block' } : { display: 'none' }}>
        {() => {
          return (
            <ProForm.Group>
              <Form.Item>
                <Select
                  options={[
                    {
                      value: 'and',
                      label: '且',
                    },
                  ]}
                  value={'and'}
                  allowClear={false}
                />
              </Form.Item>
              <ProFormSelect
                options={searchEnum}
                name="type"
                initialValue={searchEnum[0].value}
                allowClear={false}
                width={150}
              />
              <ProFormSelect
                options={[
                  {
                    value: 1,
                    label: '精准',
                  },
                  {
                    value: 2,
                    label: '模糊',
                  },
                ]}
                name="method"
                initialValue={1}
                allowClear={false}
              />
              <ProFormText name="keywords" width={350} placeholder="请输入搜索内容" />
            </ProForm.Group>
          );
        }}
      </ProFormList>
    </ProForm>
  );
};

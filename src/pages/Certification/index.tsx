import styles from './index.module.less';
import { Breadcrumb, Button, Form, Upload } from 'antd';

import { Link, request } from 'ice';

// import { appendSearch, getParams } from '@/utils/location';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

export default () => {
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const validator = async (rule, value) => {
    if (!value || !value.length) throw new Error('请上传文件');
    if (value?.find((v) => v.status === 'error')) {
      throw new Error('上传文件有误，请重新上传');
    }
  };
  return (
    <>
      <div className={styles.main}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/home">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>专家申报信息上传</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.content}>
          <div className={styles.headerTitle}>
            专家申报信息上传
            <Button type="primary">下载模版</Button>
          </div>
          <Form
            {...formItemLayout}
            style={{ padding: 30 }}
            onFinish={(v) => {
              console.log(v);
            }}
          >
            <div className={styles.groupTitle}>专家申报材料</div>
            <Form.Item
              getValueFromEvent={normFile}
              rules={[{ validator, required: true }]}
              valuePropName="fileList"
              label="申请表上传"
              name="name1"
            >
              <Upload name="name1" listType="picture-card" maxCount={1}>
                <div>上传</div>
                <div className={styles.uploadText}>必传，限制上传一份，格式为png，大小限制在10M以内</div>
              </Upload>
            </Form.Item>
            <div className={styles.groupTitle}>附件材料</div>
            <Form.Item
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
              valuePropName="fileList"
              label="个人免冠照片"
              name="name2"
            >
              <Upload
                name="name2"
                listType="picture-card"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                maxCount={1}
              >
                <div>上传</div>
                <div className={styles.uploadText}>必传，限制上传一份，格式为png，大小限制在10M以内</div>
              </Upload>
            </Form.Item>
            <Form.Item
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
              valuePropName="fileList"
              label="身份证复印件"
              name="name3"
            >
              <Upload
                name="name3"
                listType="picture-card"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                maxCount={1}
              >
                <div>上传</div>
                <div className={styles.uploadText}>必传，限制上传一份，格式为png，大小限制在10M以内</div>
              </Upload>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

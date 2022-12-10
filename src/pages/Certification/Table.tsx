/* eslint-disable react/no-array-index-key */
import styles from './index.module.less';
import { Breadcrumb, Button, Descriptions, Form, Popover, Upload } from 'antd';

import { Link, request } from 'ice';

// import { appendSearch, getParams } from '@/utils/location';

const des = [
  [
    {
      label: '姓名',
      key: 'name',
    },
    {
      label: '性别',
      key: 'male',
    },
    {
      label: '出生年月',
      key: 'birthday',
    },
    {
      key: 'url',
      row: 5,
    },
  ],
  [
    {
      label: '民族',
      key: 'minzu',
    },
    {
      label: '政治面貌',
      key: 'zzmm',
    },
    {
      label: '专业',
      key: 'zy',
    },
  ],
  [
    {
      label: '学历',
      key: 'xl',
    },
    {
      label: '学位',
      key: 'xw',
    },
    {
      label: '职业',
      key: 'zy',
    },
  ],
  [
    {
      label: '毕业院校',
      key: 'byyx',
      span: 3,
    },
  ],
  [
    {
      label: '身份证号',
      key: 'sfz',
      span: 3,
    },
  ],
  [
    {
      label: '工作单位',
      key: 'gzdw',
      span: 2,
    },
    {
      label: '单位性质',
      key: 'dwxz',
      span: 2,
    },
  ],
  [
    {
      label: '技术职称',
      key: 'jszc',
      span: 2,
    },
    {
      label: '从事专业',
      key: 'cszy',
      span: 2,
    },
  ],
  [
    {
      label: '移动电话',
      key: 'phone',
      span: 2,
    },
    {
      label: '电子邮件',
      key: 'email',
      span: 2,
    },
  ],
  [
    {
      label: '从业经历（时间、单位、职位）',
      key: 'cyjl',
      span: 4,
    },
  ],
  [
    {
      label: '相关领域 研究经验',
      key: 'xgly',
      span: 4,
    },
  ],
  [
    {
      label: '拟申请专家组',
      key: 'nsqzjz',
      span: 2,
    },
    {
      label: '申请人签字',
      key: 'sqrqz',
      span: 2,
    },
  ],
  [
    {
      label: '单位意见',
      key: 'dwyj',
      span: 4,
    },
  ],
];

const renderTable = (column, data) => {
  // const ls = [];
  // <tr className='ant-descriptions-row' key={rowi}>
  // </tr>
  const ls: any[] = [];
  des.forEach((row, rowi) => {
    const cols: any[] = [];
    row.forEach((col, coli) => {
      let labelColspan = 1;
      const labelStyle = col?.labelStyle || {};
      const colStyle = col?.colStyle || {};
      if (col.label) {
        cols.push(
          <th className="ant-descriptions-item-label" colSpan={1} key={`${rowi}-${coli}-th`} style={labelStyle}>
            {col.label}
          </th>,
        );
      } else {
        labelColspan = 0;
      }
      const contentColspan = (col?.span || 1) * 2 - labelColspan;
      if ((col.row || 1) > 1) {
        colStyle.borderLeft = '1px solid #f0f0f0';
      }
      cols.push(
        <td
          className="ant-descriptions-item-content"
          colSpan={contentColspan}
          rowSpan={col.row || 1}
          key={`${rowi}-${coli}-td`}
          style={colStyle}
        >
          {data[col.key] || '-'}
        </td>,
      );
    });
    ls.push(
      <tr className="ant-descriptions-row" key={rowi}>
        {cols}
      </tr>,
    );
  });
  return ls;
};
export default () => {
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
            <Button type="primary" style={{ marginLeft: 10 }}>
              确认
            </Button>
            <Popover
              placement="bottom"
              content={
                <div style={{ fontWeight: 400 }}>
                  <div>可咨询联系</div>
                  <div>工作人员</div>
                  <div>联系电话：</div>
                </div>
              }
            >
              <Button>反馈问题</Button>
            </Popover>
          </div>
        </div>
        <div className={styles.tableWrap} style={{ background: '#fff' }}>
          <div className={styles.tableTitle}>浙江工业产品主题库标准专家委员会专家申请表</div>
          <div className="ant-descriptions ant-descriptions-bordered">
            <div className="ant-descriptions-view">
              <table>
                <tbody>{renderTable(des, {})}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

import { SwapRightOutlined } from '@ant-design/icons';
import { List } from 'antd';
import styles from './index.module.less';

function renderSub(t, item) {
  switch (`${t}`) {
    case '1':
    case '2':
      return (
        <>
          <div>
            <div className={styles.desLabel}>制定者：{item?.teamName}</div>
            <div className={styles.desLabel} style={{ minWidth: 120 }}>
              产品类目：{item?.categoryCount || 0}个
            </div>
            <div className={styles.desLabel} style={{ minWidth: 120 }}>
              产品属性：{item?.featureCount || 0}个
            </div>
            <div className={styles.desLabel}>发布时间：{item?.pubDate}</div>
          </div>
          <a href={`/detail?domainId=${item.id}`} target="_blank" rel="noreferrer">
            查看详情 <SwapRightOutlined />
          </a>
        </>
      );
    case '3':
    case '4':
      return (
        <>
          <div>
            <div className={styles.desLabel}>
              所属标准：{item?.domainName}
              <span className="ds-version">V{item.domainVersion}</span>
            </div>
          </div>
          <a href={`/detail?domainId=${item.domainReleaseId}&selected=${item.id}`} target="_blank" rel="noreferrer">
            查看详情 <SwapRightOutlined />
          </a>
        </>
      );
    case '5':
    case '6':
      return (
        <>
          <div>
            <div className={styles.desLabel}>所属节点：{item?.categoryName}</div>
            <div className={styles.desLabel}>
              所属标准：{item?.domainName}
              <span className="ds-version">V{item.domainVersion}</span>
            </div>
          </div>
          <a
            href={`/detail?domainId=${item.domainReleaseId}&selected=${item.categoryReleaseId}`}
            target="_blank"
            rel="noreferrer"
          >
            查看详情 <SwapRightOutlined />
          </a>
        </>
      );
    default:
      return '';
  }
}
function renderTitle(item) {
  if (String(item.type) === '1' || String(item.type) === '2') {
    return `${item.name}<span class='ds-version'>V${item.version}</span>`;
  }
  return item.name;
}
export default ({ item }) => {
  return (
    <List.Item>
      <List.Item.Meta
        // eslint-disable-next-line react/no-danger
        title={<div dangerouslySetInnerHTML={{ __html: renderTitle(item) }} />}
        description={<div className={styles.content}>{renderSub(item.type, item)}</div>}
      />
    </List.Item>
  );
};

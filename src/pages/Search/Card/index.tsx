import { SwapRightOutlined } from '@ant-design/icons';
import { List } from 'antd';
import styles from './index.module.less';
import hotImage from '@/assets/hot.png';

function renderSub(t, item) {
  switch (`${t}`) {
    case '1':
    case '2':
    case '7':
      return (
        <>
          <div>
            <div className={styles.desLabel}>制订者：{item?.teamName}</div>
            <div className={styles.desLabel} style={{ minWidth: 120 }}>
              产品类目：{item?.categoryCount || 0}个
            </div>
            <div className={styles.desLabel} style={{ minWidth: 120 }}>
              产品属性：{item?.featureCount || 0}个
            </div>
            <div className={styles.desLabel}>发布时间：{item?.pubDate}</div>
          </div>
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
  let href = `/beforeDetail?domainId=${item.id}`;
  switch (`${item.type}`) {
    case '3':
    case '4':
      href = `/beforeDetail?domainId=${item.domainReleaseId}&selected=${item.id}`;
      break;
    case '5':
    case '6':
      href = `/beforeDetail?domainId=${item.domainReleaseId}&selected=${item.categoryReleaseId}`;
      break;
    default:
      break;
  }

  return (
    <List.Item>
      <List.Item.Meta
        // eslint-disable-next-line react/no-danger
        title={
          <div className={styles.title}>
            <a target="_blank" rel="noreferrer" href={href} dangerouslySetInnerHTML={{ __html: renderTitle(item) }} />
            <span style={{ fontSize: 14, marginLeft: 20, whiteSpace: 'nowrap' }}>
              <img src={hotImage} style={{ margin: '0 5px', verticalAlign: -5 }} />
              热力值：{item.hotSort}
            </span>
          </div>
        }
        description={<div className={styles.content}>{renderSub(item.type, item)}</div>}
      />
    </List.Item>
  );
};

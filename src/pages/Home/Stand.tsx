import { request, history } from 'ice';
import { useRequest } from 'ahooks';

import styles from './index.module.less';

async function getList() {
  const resData = await request({
    url: '/api/home/complexSearch/standard',
  });
  return resData;
}

const Stand = () => {
  const { data } = useRequest(getList);
  const onMore = (order = 'hotSort') => {
    history?.push(`/search?${order}=true&allType=1,2`);
  };
  const onDetail = (id) => {
    history?.push(`/detail?domainId=${id}`);
  };
  return (
    <>
      <div className={styles.flexContentTitle}>
        <div>标准发布</div>
        <div className={styles.bgTitle}>Standard Center</div>
      </div>
      <div className={styles.flexContent}>
        <div>
          <div className={styles.cardTitle}>热门标准</div>
          <div className={styles.more} onClick={() => onMore()}>
            查看更多
          </div>
          <div className={styles.list}>
            {data?.hotStandard.map((v, index) => (
              <div key={v.id} className={styles.listItem} onClick={() => onDetail(v.id)}>
                <span className={styles.iNum}>{index + 1}</span>
                <span className={styles.listName}>{v.name}</span>
                <span className={styles.date}>{v.pubDate}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className={styles.cardTitle}>最新标准</div>
          <div className={styles.more} onClick={() => onMore('newSort')}>
            查看更多
          </div>
          <div className={styles.list}>
            {data?.newStandard.map((v, index) => (
              <div key={v.id} className={styles.listItem} onClick={() => onDetail(v.id)}>
                <span className={styles.iNum}>{index + 1}</span>
                <span className={styles.listName}>{v.name}</span>
                <span className={styles.date}>{v.pubDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Stand;

import { request } from 'ice';
import { useRequest } from 'ahooks';

import { searchEnum } from '@/dataType';

import styles from './index.module.less';
import { Skeleton, Statistic } from 'antd';

const [_, ...list] = searchEnum;

async function getCount() {
  const resData = await request({
    url: '/api/home/complexSearch/total',
  });
  return resData;
}

async function getList() {
  const resData = await request({
    url: '/api/home/information/listInformation',
  });
  return resData;
}

const Stand = () => {
  const { data } = useRequest(getCount);
  const { data: lData, loading } = useRequest(getList);

  const goOut = (url) => {
    window.open(url, '_blank');
  };
  return (
    <div className={styles.stand}>
      <div className={styles.standContent}>
        <div className={styles.cards}>
          {list.map((v) => (
            <div key={v.value} className={styles.card}>
              {/* <div className={styles.cardNum}>{data?.[v.value] || 0}</div> */}
              <Statistic value={data?.[v.value] || 0} />
              <div className={styles.title}>{v.homeLabel || v.label}</div>
            </div>
          ))}
        </div>
        <div className={styles.flexContentTitle}>
          <div>消息发布</div>
          {/* <div className={styles.bgTitle}>Message Center</div> */}
        </div>
        <div className={styles.flexContent}>
          <div>
            <div className={styles.cardTitle}>通知公告</div>
            {/* <div className={styles.more}>查看更多</div> */}
            <div className={styles.list}>
              {lData?.notice?.map((v, index) => (
                <div title={v.title} key={index} className={styles.listItem} onClick={() => goOut(v.url)}>
                  <span className={styles.listName}>{v.title}</span>
                  <span className={styles.date}>{v.date}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className={styles.cardTitle}>资讯新闻</div>
            {/* <div className={styles.more}>查看更多</div> */}
            <div className={styles.list}>
              {lData?.news?.map((v, index) => (
                <div title={v.title} key={index} className={styles.listItem} onClick={() => goOut(v.url)}>
                  <span className={styles.listName}>{v.title}</span>
                  <span className={styles.date}>{v.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {loading && <Skeleton active />}
      </div>
    </div>
  );
};

export default Stand;

import { request, history } from 'ice';
import { useRequest } from 'ahooks';

import { searchEnum } from '@/dataType';

import styles from './index.module.less';

const [_, ...list] = searchEnum;

async function getCount() {
  const resData = await request({
    url: '/api/home/complexSearch/total',
  });
  return resData;
}

const dData = [
  {
    title: '现代纺织行业产品主数据品主数据',
  },
  {
    title: '现代纺织行业产品主数据品主数据',
  },
  {
    title: '现代纺织行业产品主数据品主数据',
  },
  {
    title: '现代纺织行业产品主数据品主数据',
  },
  {
    title: '现代纺织行业产品主数据品主数据',
  },
];
const Stand = () => {
  const { data } = useRequest(getCount);

  return (
    <div className={styles.stand}>
      <div className={styles.standContent}>
        <div className={styles.cards}>
          {list.map((v) => (
            <div key={v.value} className={styles.card}>
              <div className={styles.cardNum}>{data?.[v.value] || 0}</div>
              <div className={styles.title}>{v.homeLabel || v.label}</div>
            </div>
          ))}
        </div>
        <div className={styles.flexContentTitle}>
          <div>消息发布</div>
          <div className={styles.bgTitle}>Message Center</div>
        </div>
        <div className={styles.flexContent}>
          <div>
            <div className={styles.cardTitle}>热门消息</div>
            <div className={styles.more}>查看更多</div>
            <div className={styles.list}>
              {dData.map((v, index) => (
                <div key={index} className={styles.listItem}>
                  <span className={styles.iNum}>{index + 1}</span>
                  <span className={styles.listName}>{v.title}</span>
                  <span className={styles.date}>2022-08-12</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className={styles.cardTitle}>最新消息</div>
            <div className={styles.more}>查看更多</div>
            <div className={styles.list}>
              {dData.map((v, index) => (
                <div key={index} className={styles.listItem}>
                  <span className={styles.iNum}>{index + 1}</span>
                  <span className={styles.listName}>{v.title}</span>
                  <span className={styles.date}>2022-08-12</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stand;

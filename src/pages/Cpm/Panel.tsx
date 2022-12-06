import MyAffix from '@/components/MyAffix';
import { useState, useRef } from 'react';
import styles from './index.module.less';

function RightPanel({ children }) {
  const [collapse, setCollapse] = useState(false);
  const [ifBottom, setIfBottom] = useState(false);
  const originRef = useRef<HTMLDivElement>(null);

  const onAffixChange = (_, ifb) => {
    setIfBottom(ifb);
  };
  return (
    <div className={`${styles.flexContent} ${collapse && styles.open}`}>
      <MyAffix
        origin={() => originRef?.current}
        offsetTop={20}
        // onChange={onAffixChange}
        className={`${styles.leftAffix} ${collapse && styles.open} ${ifBottom && styles.bottom}`}
      >
        <div className={styles.left}>
          <div onClick={() => setCollapse(!collapse)} className={styles.collapseIcon} />
          {children[0]}
        </div>
      </MyAffix>
      <div ref={originRef} className={styles.right}>
        {children[1]}
      </div>
    </div>
  );
}
export default RightPanel;

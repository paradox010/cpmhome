import { useState } from 'react';
import styles from './index.module.less';

function RightPanel({ children }) {
  const [collapse, setCollapse] = useState(false);
  return (
    <div className={`${styles.flexContent} ${collapse && styles.open}`}>
      <div className={`${styles.left} ${collapse && styles.open}`}>
        <div onClick={() => setCollapse(!collapse)} className={styles.collapseIcon} />
        {children[0]}
      </div>
      <div className={styles.right}>{children[1]}</div>
    </div>
  );
}
export default RightPanel;

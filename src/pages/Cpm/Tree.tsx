import RcTree from 'rc-tree';
import type { BasicDataNode } from 'rc-tree';

import { useEffect, useRef, useState } from 'react';
import { history } from 'ice';
import { parse, stringify } from 'qs';

interface RTreeNode extends BasicDataNode {
  id: string;
  name: string;
  editStatus?: number;
  children?: RTreeNode[];
}

function getTowLevelKeys(originTree) {
  const keys: string[] = [];
  originTree.forEach((v) => {
    keys.push(v.id);
    v?.children?.forEach((vc) => {
      keys.push(vc.id);
      vc?.children?.forEach((vcc) => {
        keys.push(vcc.id);
      });
    });
  });
  return keys;
}

function iterTree(tree, id) {
  let qop: any[] = [];
  qop = [...tree];
  while (qop.length) {
    const i = qop.shift();
    if (i.id === id) {
      return i;
    }
    i?.children?.forEach((v) => {
      v.path = [...(i.path ? i.path : [i.id]), v.id];
    });
    if (i.children) {
      qop = [...qop, ...i.children];
    }
  }
}

const Tree = ({ data }) => {
  const [expandedKeys, setExpandedKeys] = useState([] as any[]);
  const [selectedKeys, setSelectedKeys] = useState([] as any[]);
  const treeRef = useRef<RcTree<RTreeNode>>(null);

  const [locKey, setLocKey] = useState([] as any[]);
  useEffect(() => {
    if (data) {
      const ek = getTowLevelKeys(data);
      setExpandedKeys(ek);
      const search = history?.location?.search || '';
      if (search.split('?').length > 1 && parse(search.split('?')[1])?.selected) {
        const selec = parse(search.split('?')[1])?.selected;
        const res = iterTree(data, selec);
        if (res.path) {
          setExpandedKeys(Array.from(new Set([...ek, ...res.path])));
        }
        setSelectedKeys([selec]);
        setLocKey([selec]);
      } else if (ek?.[0]) {
        onInnerSelect([ek[0]]);
      }
    }
  }, [data]);

  useEffect(() => {
    treeRef.current?.scrollTo({ key: locKey[0], align: 'top' });
  }, [locKey]);

  const onInnerSelect = (k) => {
    setSelectedKeys(k);
    if (!k[0]) return;
    const search = history?.location?.search || '';
    let ss = '';
    if (search.split('?').length > 1) {
      const obj = parse(search.split('?')[1]);
      obj.selected = k[0];
      ss = `?${stringify(obj)}`;
    } else {
      ss = `?${stringify({ selected: k[0] })}`;
    }
    history?.push({
      pathname: history?.location?.pathname,
      search: ss,
    });
  };

  return (
    <>
      <div style={{ padding: '20px 0 0 20px' }}>
        <span className="ds-tree-title-add">增</span>最近新增 <span className="ds-tree-title-update">改</span>最近修改
      </div>
      <div className="dsTree" style={{ height: 'calc(100% - 42px)' }}>
        <RcTree<RTreeNode>
          ref={treeRef}
          fieldNames={{
            children: 'children',
            title: 'name',
            key: 'id',
          }}
          icon={false}
          treeData={data || []}
          titleRender={(nodeData) => (
            <div data-index={nodeData.id} className="ds-draggeble">
              {nodeData.editStatus === 1 ? <span className="ds-tree-title-add">增</span> : null}
              {nodeData.editStatus === 2 ? <span className="ds-tree-title-update">改</span> : null}
              {nodeData.name}
            </div>
          )}
          motion={null}
          virtual={false}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          selectedKeys={selectedKeys}
          onSelect={onInnerSelect}
        />
      </div>
    </>
  );
};
export default Tree;

import RcTree from 'rc-tree';
import type { BasicDataNode } from 'rc-tree';

import { useEffect, useRef, useState } from 'react';
import { history, request } from 'ice';
import { parse, stringify } from 'qs';

import { getParams } from '@/utils/location';
import Search from './Search';

async function getTreeNodeChildren(id) {
  const resData = await request({
    url: `/api/home/productCategoryRelease/getChildren?domainId=${getParams()?.domainId}&categoryId=${id}`,
  });
  return resData;
}

interface RTreeNode extends BasicDataNode {
  id: string;
  name: string;
  editStatus?: number;
  children?: RTreeNode[];
  isLeaf?: boolean;
}

function getTowLevelKeys(originTree) {
  const keys: string[] = [];
  originTree.forEach((v) => {
    keys.push(v.id);
    // v?.children?.forEach((vc) => {
    //   keys.push(vc.id);
    //   vc?.children?.forEach((vcc) => {
    //     keys.push(vcc.id);
    //   });
    // });
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
      v.myPath = [...(i.myPath ? i.myPath : [i.id]), v.id];
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

  const [treeData, setTreeData] = useState<any[]>([]);
  useEffect(() => {
    if (data) {
      setTreeData(data);
      const mk = getTowLevelKeys(data);
      const ek = mk?.[0] ? [mk[0]] : [];
      setExpandedKeys(ek);

      const search = history?.location?.search || '';
      if (search.split('?').length > 1 && parse(search.split('?')[1])?.selected) {
        const selec = parse(search.split('?')[1])?.selected;
        const res = iterTree(data, selec);
        if (res.myPath) {
          setExpandedKeys(Array.from(new Set([...ek, ...res.myPath])));
        }
        setSelectedKeys([selec]);
        setLocKey([selec]);
      } else if (mk?.[0]) {
        onInnerSelect([mk[0]]);
      }
    }
  }, [data]);

  const onLoadData = async (treeNode) => {
    if (!treeNode.children || treeNode?.children?.length === 0) {
      // load data;
      const res = await getTreeNodeChildren(treeNode.id);
      const target = iterTree(treeData, treeNode.id);
      target.children = res;
      setTreeData((prev) => [...prev]);
    }
  };

  useEffect(() => {
    treeRef.current?.scrollTo({ key: locKey[0], align: 'top' });
  }, [locKey]);

  const onSearchSelect = (k) => {
    onInnerSelect([k]);
  };

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

  // virtual
  const ifRef = useRef<HTMLIFrameElement>(null);
  const [virtualProp, setVirtualProp] = useState({
    height: 500,
    virtual: false,
  });
  useEffect(() => {
    setVirtualProp((prev) => ({ ...prev, height: (ifRef.current?.clientHeight || 520) - 20 }));
    function resize() {
      setVirtualProp((prev) => ({ ...prev, height: (ifRef.current?.clientHeight || 520) - 20 }));
    }
    ifRef?.current?.contentWindow?.addEventListener('resize', resize);
    return () => {
      ifRef?.current?.contentWindow?.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    if (expandedKeys.length > 100) {
      setVirtualProp((prev) => ({ ...prev, virtual: true }));
    } else {
      setVirtualProp((prev) => ({ ...prev, virtual: false }));
    }
  }, [expandedKeys]);

  return (
    <>
      <div style={{ padding: '20px 10px 0 20px' }}>
        <span className="ds-tree-title-add">增</span>最近新增 <span className="ds-tree-title-update">改</span>最近修改
        <div>
          <Search id={getParams()?.domainId} onSelect={onSearchSelect} />
        </div>
      </div>
      <div
        className="dsTree"
        style={{ height: 'calc(100% - 74px)', position: 'relative', padding: '10px 8px 10px 20px' }}
      >
        <RcTree<RTreeNode>
          ref={treeRef}
          fieldNames={{
            children: 'children',
            title: 'name',
            key: 'id',
          }}
          // height={treeHeight}
          // virtual={false}
          itemHeight={28}
          {...virtualProp}
          loadData={onLoadData}
          icon={false}
          treeData={treeData || []}
          titleRender={(nodeData) => (
            <div data-index={nodeData.id} className="ds-draggeble">
              {nodeData.editStatus === 1 ? <span className="ds-tree-title-add">增</span> : null}
              {nodeData.editStatus === 2 ? <span className="ds-tree-title-update">改</span> : null}
              {nodeData.name}
            </div>
          )}
          motion={null}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          selectedKeys={selectedKeys}
          onSelect={onInnerSelect}
        />
        <iframe
          ref={ifRef}
          style={{ position: 'absolute', height: '100%', border: 'none', visibility: 'hidden', pointerEvents: 'none' }}
        />
      </div>
    </>
  );
};
export default Tree;

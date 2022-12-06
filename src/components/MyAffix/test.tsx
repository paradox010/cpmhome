/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @iceworks/best-practices/recommend-functional-component */
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import omit from 'rc-util/lib/omit';
import * as React from 'react';

import { addObserveTarget, getFixedTop, getTargetRect, removeObserveTarget, throttleByAnimationFrame } from './utils';

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}

function getScroll(target, top) {
  const prop = top ? 'pageYOffset' : 'pageXOffset';
  const method = top ? 'scrollTop' : 'scrollLeft';
  const isWindow = target === window;

  let ret = isWindow ? target[prop] : target[method];
  // ie6,7,8 standard mode
  if (isWindow && typeof ret !== 'number') {
    ret = window.document.documentElement[method];
  }

  return ret;
}

function getOffset(element, target) {
  const elemRect = element.getBoundingClientRect();
  const targetRect = getTargetRect(target);

  const scrollTop = getScroll(target, true);
  const scrollLeft = getScroll(target, false);

  const docElem = window.document.body;
  const clientTop = docElem.clientTop || 0;
  const clientLeft = docElem.clientLeft || 0;

  return {
    top: elemRect.top - targetRect.top + scrollTop - clientTop,
    left: elemRect.left - targetRect.left + scrollLeft - clientLeft,
  };
}

// Affix
export interface AffixProps {
  /** 距离窗口顶部达到指定偏移量后触发 */
  offsetTop?: number;
  style?: React.CSSProperties;
  /** 固定状态改变时触发的回调函数 */
  onChange?: (affixed?: boolean, ifFixedBottom?: boolean) => void;
  /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
  target?: () => Window | HTMLElement | null;
  origin: () => Window | HTMLElement | null;
  className?: string;
  children: React.ReactNode;
}

enum AffixStatus {
  None,
  Prepare,
}

export interface AffixState {
  affixStyle?: React.CSSProperties;
  placeholderStyle?: React.CSSProperties;
  status: AffixStatus;
  lastAffix: boolean;
  lastIfFixedBottm: boolean;
}

class Affix extends React.Component<AffixProps, AffixState> {
  state: AffixState = {
    status: AffixStatus.None,
    lastAffix: false,
    lastIfFixedBottm: false,
  };

  placeholderNode: HTMLDivElement;

  fixedNode: HTMLDivElement;

  private timeout: NodeJS.Timeout | null;

  private getTargetFunc() {
    const { target } = this.props;

    if (target !== undefined) {
      return target;
    }

    return getDefaultTarget;
  }

  // Event handler
  componentDidMount() {
    const targetFunc = this.getTargetFunc();
    if (targetFunc) {
      // [Legacy] Wait for parent component ref has its value.
      // We should use target as directly element instead of function which makes element check hard.
      this.timeout = setTimeout(() => {
        addObserveTarget(targetFunc(), this);
        // Mock Event object.
        this.updatePosition();
      });
    }
  }

  componentDidUpdate(prevProps: AffixProps) {
    if (prevProps.offsetTop !== this.props.offsetTop) {
      this.updatePosition();
    }

    this.measure();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    removeObserveTarget(this);
    this.updatePosition.cancel();
    // https://github.com/ant-design/ant-design/issues/22683
    this.lazyUpdatePosition.cancel();
  }

  getOffsetTop = () => {
    const { offsetTop } = this.props;
    return offsetTop === undefined ? 0 : offsetTop;
  };

  savePlaceholderNode = (node: HTMLDivElement) => {
    this.placeholderNode = node;
  };

  saveFixedNode = (node: HTMLDivElement) => {
    this.fixedNode = node;
  };

  // =================== Measure ===================
  measure = () => {
    const { status, lastAffix, lastIfFixedBottm } = this.state;
    const { onChange } = this.props;
    const targetFunc = this.getTargetFunc();
    if (status !== AffixStatus.Prepare || !this.fixedNode || !this.placeholderNode || !targetFunc) {
      return;
    }

    const offsetTop = this.getOffsetTop();

    const targetNode = targetFunc();
    if (!targetNode) {
      return;
    }
    const originNode = this.props.origin();

    const newState: Partial<AffixState> = {
      status: AffixStatus.None,
    };
    const targetRect = getTargetRect(targetNode);
    const originRect = getTargetRect(originNode);

    const placeholderReact = getTargetRect(this.placeholderNode);
    const fixedTop = getFixedTop(placeholderReact, targetRect, offsetTop);

    const elemOffset = getOffset(this.placeholderNode, targetNode);
    const elemSize = {
      width: this.fixedNode.offsetWidth,
      height: this.fixedNode.offsetHeight,
    };

    if (
      placeholderReact.top === 0 &&
      placeholderReact.left === 0 &&
      placeholderReact.width === 0 &&
      placeholderReact.height === 0
    ) {
      return;
    }

    let ifFixedBottom = false;
    if (fixedTop !== undefined) {
      // if (targetRect.top - originRect.top > -offsetTop && targetRect.bottom - originRect.bottom < targetRect.height) {
      // const ofh = targetRect.bottom - originRect.bottom + (elemSize.height || 0) - targetRect.height;
      newState.affixStyle = {
        position: 'fixed',
        top: fixedTop,
        // top: targetRect.top + offsetTop - (ofh > 0 ? ofh : 0),
        left: targetRect.left + elemOffset.left,
        width: placeholderReact.width,
      };
      newState.placeholderStyle = {
        width: '100%',
        height: placeholderReact.height,
      };
      // }
    }

    if (originRect.bottom - targetRect.bottom < -85) {
      newState.affixStyle = {
        position: 'absolute',
        top: 0,
      };
      ifFixedBottom = true;
    }

    newState.lastAffix = !!newState.affixStyle;
    newState.lastIfFixedBottm = !!ifFixedBottom;
    if (onChange && (lastAffix !== newState.lastAffix || lastIfFixedBottm !== newState.lastIfFixedBottm)) {
      onChange(newState.lastAffix, newState.lastIfFixedBottm);
    }

    this.setState(newState as AffixState);
  };

  // @ts-ignore TS6133
  prepareMeasure = (state?: any) => {
    // event param is used before. Keep compatible ts define here.
    this.setState({
      status: AffixStatus.Prepare,
      affixStyle: undefined,
      placeholderStyle: undefined,
      ...(state || {}),
    });
  };

  updatePosition = throttleByAnimationFrame(() => {
    this.prepareMeasure();
  });

  lazyUpdatePosition = throttleByAnimationFrame(() => {
    const targetFunc = this.getTargetFunc();
    const { affixStyle } = this.state;
    // Check position change before measure to make Safari smooth
    if (targetFunc && affixStyle) {
      const offsetTop = this.getOffsetTop();

      const targetNode = targetFunc();
      const originNode = this.props.origin();
      const originRect = getTargetRect(originNode);
      if (targetNode && originRect && this.placeholderNode) {
        const targetRect = getTargetRect(targetNode);
        const placeholderReact = getTargetRect(this.placeholderNode);
        const fixedTop = getFixedTop(placeholderReact, targetRect, offsetTop);
        console.log(originRect.bottom - targetRect.bottom);

        const shouldBottomUpdate = originRect.bottom - targetRect.bottom <= -85;
        if (shouldBottomUpdate) {
          console.log('bottomupdate');
          this.prepareMeasure();
          return;
        }
        if (fixedTop !== undefined && affixStyle.top === fixedTop) {
          // if (originRect.bottom - targetRect.bottom > -85 + 60) {
          console.log('noupdate');
          return;
          // }
          // if (originRect.bottom - targetRect.bottom < -85 - 10 || originRect.bottom - targetRect.bottom > -85 + 20) {
          //   return;
          // }
        }
      }
    }
    console.log('update');
    // Directly call prepare measure since it's already throttled.
    this.prepareMeasure();
  });

  // =================== Render ===================
  render() {
    const { affixStyle, placeholderStyle, lastIfFixedBottm } = this.state;
    const { children } = this.props;
    const className = classNames({
      'ant-affix': !!affixStyle,
    });
    console.log(affixStyle, lastIfFixedBottm);

    let props = omit(this.props, ['offsetTop', 'target', 'onChange', 'origin']);
    // Omit this since `onTestUpdatePosition` only works on test.
    if (process.env.NODE_ENV === 'test') {
      props = omit(props as typeof props & { onTestUpdatePosition: any }, ['onTestUpdatePosition']);
    }

    return (
      <ResizeObserver onResize={this.updatePosition}>
        <div {...props} ref={this.savePlaceholderNode}>
          {affixStyle && <div style={placeholderStyle} aria-hidden="true" />}
          <div className={className} ref={this.saveFixedNode} style={affixStyle}>
            <ResizeObserver onResize={this.updatePosition}>{children}</ResizeObserver>
          </div>
        </div>
      </ResizeObserver>
    );
  }
}
// just use in test
export type InternalAffixClass = Affix;

// const AffixFC = React.forwardRef<Affix, AffixProps>((props, ref) => {

//   const AffixProps: AffixProps = {
//     ...props,
//     rootClassName: hashId,
//   };

//   return <Affix {...AffixProps} ref={ref} />;
// });

// if (process.env.NODE_ENV !== 'production') {
//   AffixFC.displayName = 'Affix';
// }

export default Affix;

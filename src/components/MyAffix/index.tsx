/* eslint-disable @iceworks/best-practices/recommend-functional-component */
/* eslint-disable react/no-find-dom-node */
import React from 'react';
import classNames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

import shallowequal from 'shallowequal';

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

function getTargetRect(target) {
  return target !== window
    ? target.getBoundingClientRect()
    : { top: 0, left: 0, bottom: window.innerHeight, height: window.innerHeight };
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

interface AffixState {
  affixStyle: any;
  placeholderStyle: any;
  fixed: boolean;
}
interface AffixProps {
  target?: () => HTMLElement | Window | null;
  origin: () => HTMLElement | Window | null;
  onChange?: (v: boolean, f: boolean) => void;
  style?: CSSStyleDeclaration;
  offsetTop?: number;
  className?: string;
}

export default class TableAffix extends React.Component<AffixProps, AffixState> {
  myRef: React.RefObject<HTMLDivElement>;
  placeRef: React.RefObject<HTMLDivElement>;
  scrollEvent: any;
  resizeEvent: any;

  state: AffixState = {
    affixStyle: null,
    placeholderStyle: null,
    fixed: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      affixStyle: null,
      placeholderStyle: null,
      fixed: false,
    } as any;
    this.myRef = React.createRef();
    this.placeRef = React.createRef();
  }

  componentDidMount() {
    // warning(!('offset' in this.props),
    // '`offset` prop of Affix is deprecated, use `offsetTop` instead.');
    const target = this.props?.target || (() => window);
    this.setTargetEventListeners(target);
  }

  componentWillUnmount() {
    this.clearScrollEventListeners();
  }

  setAffixStyle(e, affixStyle) {
    const { onChange } = this.props;
    const originalAffixStyle = this.state.affixStyle;
    // const isWindow = target() === window;
    // if (e.type === 'scroll' && originalAffixStyle && affixStyle && isWindow) {
    //   return;
    // }
    if (shallowequal(affixStyle, originalAffixStyle)) {
      return;
    }
    this.setState({ affixStyle }, () => {
      const affixed = !!this.state.affixStyle;
      if ((affixStyle && !originalAffixStyle) || (!affixStyle && originalAffixStyle)) {
        onChange && onChange(affixed, false);
      }
    });
  }

  setPlaceholderStyle(e, placeholderStyle) {
    const originalPlaceholderStyle = this.state.placeholderStyle;
    if (e.type === 'resize') {
      return;
    }
    if (shallowequal(placeholderStyle, originalPlaceholderStyle)) {
      return;
    }
    this.setState({ placeholderStyle });
  }

  setTargetEventListeners(getTarget) {
    const target = getTarget();
    if (target) {
      this.scrollEvent = addEventListener(target, 'scroll', this.updatePosition);
      this.resizeEvent = addEventListener(target, 'resize', this.updatePosition);
    }
  }

  updatePosition = (e) => {
    const { origin } = this.props;
    const target = this.props?.target || (() => window);

    const targetNode = target();
    const originNode = origin();

    // Backwards support
    //    const scrollTop = getScroll(targetNode, true);
    // eslint-disable-next-line react/no-find-dom-node
    const elemOffset = getOffset(this.placeRef.current, targetNode);
    const elemSize = {
      width: this.myRef.current?.offsetWidth,
      height: this.myRef.current?.offsetHeight,
    };

    const targetRect = getTargetRect(targetNode);
    const originRect = getTargetRect(originNode);
    const offsetTop = this.props?.offsetTop || 0;
    //    const targetInnerHeight = targetNode.innerHeight || targetNode.clientHeight;
    if (targetRect.top - originRect.top > -offsetTop && targetRect.bottom - originRect.bottom < targetRect.height) {
      const ofh = targetRect.bottom - originRect.bottom + 20 + (elemSize.height || 0) - targetRect.height;
      if (
        ofh <= 0 &&
        this.state.affixStyle?.position === 'fixed' &&
        this.state.affixStyle?.top === targetRect.top + offsetTop
      ) {
        return;
      }
      this.setAffixStyle(e, {
        position: 'fixed',
        top: targetRect.top + offsetTop - (ofh > 0 ? ofh : 0),
        left: targetRect.left + elemOffset.left,
        width: this.placeRef?.current?.offsetWidth || 0,
      });
      this.setPlaceholderStyle(e, {
        ...this.props.style,
        width: this.placeRef?.current?.offsetWidth || 0,
        height: this.placeRef?.current?.offsetHeight || 0,
      });
      this.setState({ fixed: true });
    } else {
      this.setAffixStyle(e, null);
      this.setPlaceholderStyle(e, { ...this.props.style });
      this.setState({ fixed: false });
    }
  };

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (this.props.target !== nextProps.target) {
  //     this.clearScrollEventListeners();
  //     this.setTargetEventListeners(nextProps.target);

  //     // Mock Event object.
  //     this.updatePosition({});
  //   }
  // }

  clearScrollEventListeners() {
    ['scrollEvent', 'resizeEvent'].forEach((name) => {
      if (this[name]) {
        this[name].remove();
      }
    });
  }

  render() {
    const className = this.state.fixed
      ? classNames({ 'ant-affix': this.state.affixStyle, 'is-fixed': {} })
      : classNames({ 'ant-affix': this.state.affixStyle });

    const { children, target, origin, onChange, offsetTop, ...rest } = this.props;
    // delete props.target;
    // delete props.origin;

    return (
      <div {...rest} style={this.state.placeholderStyle} ref={this.placeRef}>
        <div className={className} ref={this.myRef} style={this.state.affixStyle}>
          {children}
        </div>
      </div>
    );
  }
}

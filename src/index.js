import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import animateCSS from 'animate.css';

import { timeShape, easingShape } from './propTypes';
import animations from './animations/index.scss';

class Animated extends PureComponent {
  constructor(props) {
    super(props);
    this.styles = { ...animateCSS, ...animations, ...props.animations };
    this.state = props.animateOnMount ? (
      this.getAnimatedState(props)
    ) : {};
  }

  componentWillReceiveProps(nextProps) {
    const { isVisible } = nextProps;

    if (isVisible !== this.props.isVisible) {
      this.setState(this.getAnimatedState(nextProps));
    }
  }

  getAnimatedState = (props) => {
    const {
      isVisible,
      animationIn,
      animationOut,
      duration,
      easing,
      delay,
    } = props;

    const type = isVisible ? 'in' : 'out';

    return {
      animation: isVisible ? animationIn : animationOut,
      delay: delay[type] === 0 || delay[type] ? delay[type] : delay,
      easing: easing[type] ? easing[type] : easing,
      duration: duration[type] === 0 || duration[type] ? duration[type] : duration,
    };
  };

  render() {
    const {
      style,
      className,
      children,
      innerRef,
      isVisible,
      onClick,
    } = this.props;

    const {
      delay,
      easing,
      duration,
      animation,
    } = this.state;

    style.opacity = animation ? null : Number(isVisible);

    return (
      <div
        className={classnames(className, this.styles.animated, this.styles[animation])}
        ref={innerRef}
        style={{
          animationDelay: `${delay}ms`,
          animationTimingFunction: easing,
          animationDuration: `${duration}ms`,
          pointerEvents: isVisible ? 'all' : 'none',
          ...style,
        }}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
Animated.propTypes = {
  className: PropTypes.string,
  innerRef: PropTypes.func,
  style: PropTypes.object,
  isVisible: PropTypes.bool,
  animations: PropTypes.object,
  animationIn: PropTypes.string,
  animationOut: PropTypes.string,
  delay: timeShape,
  duration: timeShape,
  easing: easingShape,
  animateOnMount: PropTypes.bool,
  children: PropTypes.any,
  onClick: PropTypes.func,
};
/* eslint-enable */

Animated.defaultProps = {
  style: {},
  animations: {},
  isVisible: true,
  animationIn: 'fadeIn',
  animationOut: 'fadeOut',
  delay: 0,
  duration: 300,
  easing: 'ease',
  animateOnMount: false,
};

export default Animated;

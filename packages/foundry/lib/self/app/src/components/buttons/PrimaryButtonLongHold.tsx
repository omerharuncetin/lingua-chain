// SPDX-License-Identifier: BUSL-1.1; Copyright (c) 2025 Social Connect Labs, Inc.; Licensed under BUSL-1.1 (see LICENSE); Apache-2.0 from 2029-06-11

import React, { useEffect, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  useAnimatedValue,
} from 'react-native';

import { ButtonProps } from './AbstractButton';
import { PrimaryButton } from './PrimaryButton';

type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;

const ACTION_TIMER = 600; // time in ms
//slate400 to slate800 but in rgb
const COLORS: RGBA[] = ['rgba(30, 41, 59, 0.3)', 'rgba(30, 41, 59, 1)'];
export function HeldPrimaryButton({
  children,
  onLongPress,
  ...props
}: ButtonProps & { onLongPress: () => void }) {
  const animation = useAnimatedValue(0);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onPressIn = () => {
    setHasTriggered(false);
    Animated.timing(animation, {
      toValue: 1,
      duration: ACTION_TIMER,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    if (!hasTriggered) {
      Animated.timing(animation, {
        toValue: 0,
        duration: ACTION_TIMER,
        useNativeDriver: true,
      }).start();
    }
  };

  const getButtonSize = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width - 1;
    const height = e.nativeEvent.layout.height - 1;
    setSize({ width, height });
  };

  const getProgressStyles = () => {
    const scaleX = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const bgColor = animation.interpolate({
      inputRange: [0, 1],
      outputRange: COLORS,
    });
    return {
      transform: [{ scaleX }],
      backgroundColor: bgColor,
      height: size.height,
    };
  };

  useEffect(() => {
    animation.addListener(({ value }) => {
      if (value >= 0.95 && !hasTriggered) {
        setHasTriggered(true);
        onLongPress();
      }
    });
    return () => {
      animation.removeAllListeners();
    };
  }, [animation, hasTriggered, onLongPress]);

  return (
    <PrimaryButton
      {...props}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      // @ts-expect-error actually it is there
      onLayout={getButtonSize}
      animatedComponent={
        <Animated.View style={[styles.fill, size, getProgressStyles()]} />
      }
    >
      {children}
    </PrimaryButton>
  );
}
const styles = StyleSheet.create({
  fill: {
    transformOrigin: 'left',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 4,
  },
});

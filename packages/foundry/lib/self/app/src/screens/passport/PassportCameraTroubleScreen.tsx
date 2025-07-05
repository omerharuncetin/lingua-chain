// SPDX-License-Identifier: BUSL-1.1; Copyright (c) 2025 Social Connect Labs, Inc.; Licensed under BUSL-1.1 (see LICENSE); Apache-2.0 from 2029-06-11

import React from 'react';

import Tips, { TipProps } from '../../components/Tips';
import { Caption } from '../../components/typography/Caption';
import useHapticNavigation from '../../hooks/useHapticNavigation';
import SimpleScrolledTitleLayout from '../../layouts/SimpleScrolledTitleLayout';
import analytics from '../../utils/analytics';
import { slate500 } from '../../utils/colors';

const { flush: flushAnalytics } = analytics();

const tips: TipProps[] = [
  {
    title: 'Use Good Lighting',
    body: 'Try scanning in a well-lit area to reduce glare or shadows on the passport page.',
  },
  {
    title: 'Lay It Flat',
    body: 'Place your passport on a stable, flat surface to keep the ID page smooth and fully visible.',
  },
  {
    title: 'Hold Steady',
    body: 'Keep your phone as still as possible; any movement can cause blurry images.',
  },
  {
    title: 'Fill the Frame',
    body: 'Make sure the entire ID page is within the camera view, with all edges visible.',
  },
  {
    title: 'Avoid Reflections',
    body: 'Slightly tilt the passport or your phone if bright lights create glare on the page.',
  },
];

const PassportCameraTrouble: React.FC = () => {
  const go = useHapticNavigation('PassportCamera', { action: 'cancel' });

  // error screen, flush analytics
  React.useEffect(() => {
    flushAnalytics();
  }, []);

  return (
    <SimpleScrolledTitleLayout
      title="Having trouble scanning your passport?"
      onDismiss={go}
    >
      <Caption size="large" color={slate500}>
        Here are a few tips that might help:
      </Caption>
      <Tips items={tips} />
      <Caption size="large" color={slate500}>
        Following these steps should help your phone's camera capture the ID
        page quickly and clearly!
      </Caption>
    </SimpleScrolledTitleLayout>
  );
};

export default PassportCameraTrouble;

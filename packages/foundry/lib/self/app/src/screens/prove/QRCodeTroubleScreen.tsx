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
    title: 'Ensure Valid QR Code',
    body: "Make sure you're scanning a QR code from a supported Self partner application.",
  },
  {
    title: 'Try Different Distances',
    body: 'If scanning fails, try moving your device closer to the QR code or increase the size of the QR code on the screen.',
  },
  {
    title: 'Proper Lighting',
    body: "Ensure there's adequate lighting in the room. QR codes need good contrast to be read properly.",
  },
  {
    title: 'Hold Steady',
    body: 'Keep your device steady while scanning to prevent blurry images that might not scan correctly.',
  },
  {
    title: 'Clean Lens',
    body: 'Make sure your camera lens is clean and free of smudges or debris that could interfere with scanning.',
  },
];

const tipsDeeplink: TipProps[] = [
  {
    title: 'Coming from another app/website?',
    body: 'Please contact the support, a telegram group is available in the options menu.',
  },
];

const QRCodeTrouble: React.FC = () => {
  const go = useHapticNavigation('Home', { action: 'cancel' });

  // error screen, flush analytics
  React.useEffect(() => {
    flushAnalytics();
  }, []);

  return (
    <SimpleScrolledTitleLayout
      title="Having trouble scanning the QR code?"
      onDismiss={go}
    >
      <Caption size="large" color={slate500}>
        Here are some tips to help you successfully scan the QR code:
      </Caption>
      <Tips items={tips} />
      <Tips items={tipsDeeplink} />
    </SimpleScrolledTitleLayout>
  );
};

export default QRCodeTrouble;

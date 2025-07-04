// SPDX-License-Identifier: BUSL-1.1; Copyright (c) 2025 Social Connect Labs, Inc.; Licensed under BUSL-1.1 (see LICENSE); Apache-2.0 from 2029-06-11

import React from 'react';

import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import Description from '../../components/typography/Description';
import { Title } from '../../components/typography/Title';
import useHapticNavigation from '../../hooks/useHapticNavigation';
import { ExpandableBottomLayout } from '../../layouts/ExpandableBottomLayout';
import analytics from '../../utils/analytics';
import { black, slate200, white } from '../../utils/colors';

const { flush: flushAnalytics } = analytics();

const PassportDataNotFound: React.FC = () => {
  const onPress = useHapticNavigation('Launch');

  // error screen, flush analytics
  React.useEffect(() => {
    flushAnalytics();
  }, []);

  return (
    <ExpandableBottomLayout.Layout backgroundColor={black}>
      <ExpandableBottomLayout.TopSection backgroundColor={black}>
        <Title textAlign="center" style={{ color: white }}>
          ✨ Are you new here?
        </Title>
        <Description mt={8} textAlign="center" style={{ color: slate200 }}>
          It seems like you need to go through the registration flow first.
        </Description>
      </ExpandableBottomLayout.TopSection>
      <ExpandableBottomLayout.BottomSection
        gap={20}
        height={150}
        backgroundColor={white}
      >
        <PrimaryButton onPress={onPress}>Go to Registration</PrimaryButton>
      </ExpandableBottomLayout.BottomSection>
    </ExpandableBottomLayout.Layout>
  );
};

export default PassportDataNotFound;

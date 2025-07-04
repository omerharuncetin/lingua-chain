// SPDX-License-Identifier: BUSL-1.1; Copyright (c) 2025 Social Connect Labs, Inc.; Licensed under BUSL-1.1 (see LICENSE); Apache-2.0 from 2029-06-11

import { useFocusEffect } from '@react-navigation/native';
import { PassportMetadata } from '@selfxyz/common';
import React, { useCallback, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, Separator, XStack, YStack } from 'tamagui';

import { Caption } from '../../components/typography/Caption';
import { usePassport } from '../../providers/passportDataProvider';
import { black, slate200, white } from '../../utils/colors';
import { extraYPadding } from '../../utils/constants';

// TODO clarify if we need more/less keys to be displayed
const dataKeysToLabels: Record<
  keyof Omit<PassportMetadata, 'countryCode' | 'dsc' | 'csca'>,
  string
> = {
  dataGroups: 'Data Groups',
  dg1Size: 'DG1 Size',
  dg1HashSize: 'DG1 Hash Size',
  dg1HashFunction: 'DG1 Hash Function',
  dg1HashOffset: 'DG1 Hash Offset',
  dgPaddingBytes: 'DG Padding Bytes',
  eContentSize: 'eContent Size',
  eContentHashFunction: 'eContent Hash Function',
  eContentHashOffset: 'eContent Hash Offset',
  signedAttrSize: 'Signed Attributes Size',
  signedAttrHashFunction: 'Signed Attributes Hash Function',
  signatureAlgorithm: 'Signature Algorithm',
  curveOrExponent: 'Curve or Exponent',
  saltLength: 'Salt Length',
  signatureAlgorithmBits: 'Signature Algorithm Bits',
  cscaFound: 'CSCA Found',
  cscaHashFunction: 'CSCA Hash Function',
  cscaSignatureAlgorithm: 'CSCA Signature Algorithm',
  cscaCurveOrExponent: 'CSCA Curve or Exponent',
  cscaSaltLength: 'CSCA Salt Length',
  cscaSignatureAlgorithmBits: 'CSCA Signature Algorithm Bits',
};

const InfoRow: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => (
  <YStack>
    <XStack py="$4" justifyContent="space-between">
      <Caption size="large">{label}</Caption>
      <Caption color={black} size="large">
        {value}
      </Caption>
    </XStack>
    <Separator borderColor={slate200} />
  </YStack>
);

interface PassportDataInfoScreenProps {}

const PassportDataInfoScreen: React.FC<PassportDataInfoScreenProps> = ({}) => {
  const { getData } = usePassport();
  const [metadata, setMetadata] = useState<PassportMetadata | null>(null);
  const { bottom } = useSafeAreaInsets();

  const loadData = useCallback(async () => {
    if (metadata) {
      return;
    }

    const result = await getData();

    if (!result || !result.data) {
      // maybe handle error instead
      return;
    }

    setMetadata(result.data.passportMetadata!);
  }, [metadata, getData]);

  useFocusEffect(() => {
    loadData();
  });

  return (
    <YStack
      f={1}
      gap="$2"
      jc="flex-start"
      paddingBottom={bottom + extraYPadding}
      backgroundColor={white}
    >
      <ScrollView backgroundColor={white} px="$4">
        {Object.entries(dataKeysToLabels).map(([key, label]) => (
          <InfoRow
            key={key}
            label={label}
            value={
              !metadata
                ? ''
                : key === 'cscaFound'
                  ? metadata?.cscaFound === true
                    ? 'Yes'
                    : 'No'
                  : (metadata?.[key as keyof PassportMetadata] as
                      | string
                      | number) || 'None'
            }
          />
        ))}
      </ScrollView>
    </YStack>
  );
};

export default PassportDataInfoScreen;

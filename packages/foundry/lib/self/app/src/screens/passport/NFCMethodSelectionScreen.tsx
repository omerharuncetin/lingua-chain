// SPDX-License-Identifier: BUSL-1.1; Copyright (c) 2025 Social Connect Labs, Inc.; Licensed under BUSL-1.1 (see LICENSE); Apache-2.0 from 2029-06-11

import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Platform, ScrollView } from 'react-native';
import { Input, YStack } from 'tamagui';

import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { SecondaryButton } from '../../components/buttons/SecondaryButton';
import ButtonsContainer from '../../components/ButtonsContainer';
import { BodyText } from '../../components/typography/BodyText';
import Description from '../../components/typography/Description';
import { Title } from '../../components/typography/Title';
import { ExpandableBottomLayout } from '../../layouts/ExpandableBottomLayout';
import useUserStore from '../../stores/userStore';
import { white } from '../../utils/colors';

type NFCParams = {
  skipPACE?: boolean;
  canNumber?: string;
  useCan?: boolean;
  skipCA?: boolean;
  extendedMode?: boolean;
};

const NFC_METHODS = [
  {
    key: 'standard',
    label: 'Standard Scan',
    description: 'Use the default NFC scan method (MRZ-based authentication).',
    platform: ['ios'],
    params: {},
  },
  {
    // We try PACE first, but if it fails, we try BAC authentication.
    // Some chips will invalidate the session if PACE fails.
    key: 'skipPACE',
    label: 'Skip PACE',
    description:
      'Skip PACE protocol during NFC scan. Useful if your passport does not support PACE.',
    platform: ['ios'],
    params: { skipPACE: true },
  },
  {
    key: 'can',
    label: 'CAN Authentication',
    description:
      'Use Card Access Number (CAN) for authentication. Enter your CAN below.',
    platform: ['ios', 'android'],
    params: { useCan: true },
  },
  {
    key: 'extendedMode',
    label: 'Extended Mode',
    description:
      'Use extended mode for authentication. This increases the response buffer size during active authentication.',
    platform: ['ios'],
    params: { extendedMode: true },
  },
  {
    key: 'mrzCorrection',
    label: 'Edit MRZ',
    description:
      'Edit the MRZ fields manually. This allows to correct the MRZ if it is incorrect.',
    platform: ['ios', 'android'],
    params: {},
  },

  // we have these options, but its not recommended to use them in production.
  // We can enable this during development.
  // {
  //   key: 'skipCA',
  //   label: 'Skip CA',
  //   description:
  //     'Skip Chip Authentication (CA). Chip authentication is like AA, that prevents clonned passports',
  //   platform: ['ios'],
  //   params: { skipCA: true },
  // },
];

const NFCMethodSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState('standard');
  const [canValue, setCanValue] = useState('');
  const [error, setError] = useState('');
  const updatePassport = useUserStore(state => state.update);
  const passportNumber = useUserStore(state => state.passportNumber);
  const dateOfBirth = useUserStore(state => state.dateOfBirth);
  const dateOfExpiry = useUserStore(state => state.dateOfExpiry);

  const handleSelect = (key: string) => {
    setSelectedMethod(key);
    setError('');
  };

  const onPassportNumberChange = (text: string) => {
    updatePassport({ passportNumber: text });
  };

  const onDateOfBirthChange = (text: string) => {
    updatePassport({ dateOfBirth: text });
  };

  const onDateOfExpiryChange = (text: string) => {
    updatePassport({ dateOfExpiry: text });
  };

  const handleProceed = () => {
    const method = NFC_METHODS.find(m => m.key === selectedMethod);
    if (!method) return;
    if (selectedMethod === 'can' && !canValue) {
      setError('Please enter your CAN number.');
      return;
    }

    const params: NFCParams = {
      ...method.params,
    };
    if (selectedMethod === 'can') {
      params.canNumber = canValue;
    }
    navigation.navigate('PassportNFCScan', params as any);
  };

  return (
    <ExpandableBottomLayout.Layout backgroundColor={white}>
      <ExpandableBottomLayout.TopSection backgroundColor={white}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack paddingTop={20} gap={20}>
            <Title>Choose NFC Scan Method</Title>

            {NFC_METHODS.filter(method =>
              method.platform.includes(Platform.OS),
            ).map(method => (
              <YStack
                key={method.key}
                borderWidth={selectedMethod === method.key ? 2 : 1}
                borderColor={selectedMethod === method.key ? '#007AFF' : '#ccc'}
                borderRadius={10}
                padding={16}
                onPress={() => handleSelect(method.key)}
                backgroundColor={
                  selectedMethod === method.key ? '#F0F8FF' : '#fff'
                }
                pressStyle={{ backgroundColor: '#F0F8FF' }}
              >
                <Title>{method.label}</Title>
                <Description>{method.description}</Description>
                {method.key === 'can' && selectedMethod === 'can' && (
                  <YStack marginTop={12} gap={8}>
                    <Input
                      placeholder="Enter CAN number"
                      value={canValue}
                      onChangeText={setCanValue}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={6}
                    />
                    {error ? (
                      <Description color="red">{error}</Description>
                    ) : null}
                  </YStack>
                )}
                {method.key === 'mrzCorrection' &&
                  selectedMethod === 'mrzCorrection' && (
                    <YStack marginTop={12} gap={8}>
                      <Input
                        placeholder="Enter Passport/ID Number"
                        value={passportNumber}
                        onChangeText={onPassportNumberChange}
                      />

                      <BodyText>Birth Date (YYMMDD)</BodyText>
                      <Input
                        placeholder="YYMMDD"
                        value={dateOfBirth}
                        onChangeText={onDateOfBirthChange}
                        keyboardType="numeric"
                        maxLength={6}
                      />

                      <BodyText>Date of Expiry (YYMMDD)</BodyText>
                      <Input
                        placeholder="YYMMDD"
                        value={dateOfExpiry}
                        onChangeText={onDateOfExpiryChange}
                        keyboardType="numeric"
                        maxLength={6}
                      />
                    </YStack>
                  )}
              </YStack>
            ))}
          </YStack>
        </ScrollView>
      </ExpandableBottomLayout.TopSection>

      <ExpandableBottomLayout.BottomSection backgroundColor={white}>
        <ButtonsContainer>
          <PrimaryButton onPress={handleProceed}>Proceed</PrimaryButton>
          <SecondaryButton onPress={() => navigation.goBack()}>
            Cancel
          </SecondaryButton>
        </ButtonsContainer>
      </ExpandableBottomLayout.BottomSection>
    </ExpandableBottomLayout.Layout>
  );
};

export default NFCMethodSelectionScreen;

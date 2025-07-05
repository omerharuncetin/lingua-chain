// SPDX-License-Identifier: BUSL-1.1; Copyright (c) 2025 Social Connect Labs, Inc.; Licensed under BUSL-1.1 (see LICENSE); Apache-2.0 from 2029-06-11

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  getSKIPEM,
  initPassportDataParsing,
  PassportData,
} from '@selfxyz/common';
import { CircleHelp } from '@tamagui/lucide-icons';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import NfcManager from 'react-native-nfc-manager';
import { Button, Image, XStack } from 'tamagui';

import passportVerifyAnimation from '../../assets/animations/passport_verify.json';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { SecondaryButton } from '../../components/buttons/SecondaryButton';
import ButtonsContainer from '../../components/ButtonsContainer';
import TextsContainer from '../../components/TextsContainer';
import { BodyText } from '../../components/typography/BodyText';
import Description from '../../components/typography/Description';
import { Title } from '../../components/typography/Title';
import { PassportEvents } from '../../consts/analytics';
import useHapticNavigation from '../../hooks/useHapticNavigation';
import NFC_IMAGE from '../../images/nfc.png';
import { ExpandableBottomLayout } from '../../layouts/ExpandableBottomLayout';
import { storePassportData } from '../../providers/passportDataProvider';
import useUserStore from '../../stores/userStore';
import analytics from '../../utils/analytics';
import { black, slate100, slate500, white } from '../../utils/colors';
import { buttonTap } from '../../utils/haptic';
import { parseScanResponse, scan } from '../../utils/nfcScanner';

const { trackEvent } = analytics();

interface PassportNFCScanScreenProps {}

const emitter =
  Platform.OS === 'android'
    ? new NativeEventEmitter(NativeModules.nativeModule)
    : null;

const PassportNFCScanScreen: React.FC<PassportNFCScanScreenProps> = ({}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { passportNumber, dateOfBirth, dateOfExpiry } = useUserStore();
  const [dialogMessage, setDialogMessage] = useState('');
  const [isNfcSupported, setIsNfcSupported] = useState(true);
  const [isNfcEnabled, setIsNfcEnabled] = useState(true);
  const [isNfcSheetOpen, setIsNfcSheetOpen] = useState(false);

  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  const goToNFCMethodSelection = useHapticNavigation(
    'PassportNFCMethodSelection',
  );
  const goToNFCTrouble = useHapticNavigation('PassportNFCTrouble');

  // 5-taps with a single finger
  const devModeTap = Gesture.Tap()
    .numberOfTaps(5)
    .onStart(() => {
      goToNFCMethodSelection();
    });

  const openErrorModal = useCallback(
    (message: string) => {
      navigation.navigate('Modal', {
        titleText: 'NFC Scan Error',
        bodyText: message,
        buttonText: 'Dismiss',
        secondaryButtonText: 'Help',
        onButtonPress: () => {},
        onModalDismiss: goToNFCTrouble,
        preventDismiss: true,
      });
    },
    [navigation, goToNFCTrouble],
  );

  const checkNfcSupport = useCallback(async () => {
    const isSupported = await NfcManager.isSupported();
    if (isSupported) {
      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        setDialogMessage(
          'NFC is not enabled. Would you like to enable it in settings?',
        );
        setIsNfcEnabled(false);
      }
      setIsNfcSupported(true);
    } else {
      setDialogMessage(
        "Sorry, your device doesn't seem to have an NFC reader.",
      );
      setIsNfcSupported(false);
    }
  }, []);

  const onVerifyPress = useCallback(async () => {
    buttonTap();
    if (isNfcEnabled) {
      setIsNfcSheetOpen(true);
      // Add timestamp when scan starts
      const scanStartTime = Date.now();

      try {
        const { canNumber, useCan, skipPACE, skipCA, extendedMode } =
          (route.params || {}) as any;

        const scanResponse = await scan({
          passportNumber,
          dateOfBirth,
          dateOfExpiry,
          canNumber,
          useCan,
          skipPACE,
          skipCA,
          extendedMode,
        });

        const scanDurationSeconds = (
          (Date.now() - scanStartTime) /
          1000
        ).toFixed(2);
        console.log(
          'NFC Scan Successful - Duration:',
          scanDurationSeconds,
          'seconds',
        );
        trackEvent(PassportEvents.NFC_SCAN_SUCCESS, {
          duration_seconds: parseFloat(scanDurationSeconds),
        });
        let passportData: PassportData | null = null;
        let parsedPassportData: PassportData | null = null;
        try {
          passportData = parseScanResponse(scanResponse);
        } catch (e: any) {
          console.error('Parsing NFC Response Unsuccessful');
          trackEvent(PassportEvents.NFC_RESPONSE_PARSE_FAILED, {
            error: e.message,
          });
          return;
        }
        try {
          const skiPem = await getSKIPEM('production');
          parsedPassportData = initPassportDataParsing(passportData, skiPem);
          const passportMetadata = parsedPassportData.passportMetadata!;
          let dscObject;
          try {
            dscObject = { dsc: passportMetadata.dsc };
          } catch (error) {
            console.error('Failed to parse dsc:', error);
            dscObject = {};
          }

          trackEvent(PassportEvents.PASSPORT_PARSED, {
            success: true,
            data_groups: passportMetadata.dataGroups,
            dg1_size: passportMetadata.dg1Size,
            dg1_hash_size: passportMetadata.dg1HashSize,
            dg1_hash_function: passportMetadata.dg1HashFunction,
            dg1_hash_offset: passportMetadata.dg1HashOffset,
            dg_padding_bytes: passportMetadata.dgPaddingBytes,
            e_content_size: passportMetadata.eContentSize,
            e_content_hash_function: passportMetadata.eContentHashFunction,
            e_content_hash_offset: passportMetadata.eContentHashOffset,
            signed_attr_size: passportMetadata.signedAttrSize,
            signed_attr_hash_function: passportMetadata.signedAttrHashFunction,
            signature_algorithm: passportMetadata.signatureAlgorithm,
            salt_length: passportMetadata.saltLength,
            curve_or_exponent: passportMetadata.curveOrExponent,
            signature_algorithm_bits: passportMetadata.signatureAlgorithmBits,
            country_code: passportMetadata.countryCode,
            csca_found: passportMetadata.cscaFound,
            csca_hash_function: passportMetadata.cscaHashFunction,
            csca_signature_algorithm: passportMetadata.cscaSignatureAlgorithm,
            csca_salt_length: passportMetadata.cscaSaltLength,
            csca_curve_or_exponent: passportMetadata.cscaCurveOrExponent,
            csca_signature_algorithm_bits:
              passportMetadata.cscaSignatureAlgorithmBits,
            dsc: dscObject,
            dsc_aki: passportData.dsc_parsed?.authorityKeyIdentifier,
            dsc_ski: passportData.dsc_parsed?.subjectKeyIdentifier,
          });
          await storePassportData(parsedPassportData);
          // Feels better somehow
          await new Promise(resolve => setTimeout(resolve, 1000));
          navigation.navigate('ConfirmBelongingScreen', {});
        } catch (e: any) {
          console.error('Passport Parsed Failed:', e);
          trackEvent(PassportEvents.PASSPORT_PARSE_FAILED, {
            error: e.message,
          });
          return;
        }
      } catch (e: any) {
        const scanDurationSeconds = (
          (Date.now() - scanStartTime) /
          1000
        ).toFixed(2);
        console.error('NFC Scan Unsuccessful:', e);
        trackEvent(PassportEvents.NFC_SCAN_FAILED, {
          error: e.message,
          duration_seconds: parseFloat(scanDurationSeconds),
        });
        openErrorModal(e.message);
      } finally {
        setIsNfcSheetOpen(false);
      }
    } else if (isNfcSupported) {
      if (Platform.OS === 'ios') {
        Linking.openURL('App-Prefs:root=General&path=About');
      } else {
        Linking.sendIntent('android.settings.NFC_SETTINGS');
      }
    }
  }, [
    isNfcSupported,
    isNfcEnabled,
    passportNumber,
    dateOfBirth,
    dateOfExpiry,
    route.params,
  ]);

  const onCancelPress = useHapticNavigation('Launch', {
    action: 'cancel',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _cancelScanIfRunning = useCallback(async () => {
    // // TODO: cancel if scanning
    // setIsNfcSheetOpen(false);
  }, [isNfcSheetOpen]);

  useFocusEffect(
    useCallback(() => {
      checkNfcSupport();

      if (Platform.OS === 'android' && emitter) {
        const subscription = emitter.addListener(
          'NativeEvent',
          (event: string) => console.info(event),
        );

        return () => {
          subscription.remove();
        };
      }
    }, [checkNfcSupport]),
  );

  return (
    <ExpandableBottomLayout.Layout backgroundColor={black}>
      <ExpandableBottomLayout.TopSection roundTop backgroundColor={slate100}>
        <LottieView
          ref={animationRef}
          autoPlay={false}
          loop={false}
          onAnimationFinish={() => {
            setTimeout(() => {
              animationRef.current?.play();
            }, 5000); // Pause 5 seconds before playing again
          }}
          source={passportVerifyAnimation}
          style={styles.animation}
          cacheComposition={true}
          renderMode="HARDWARE"
        />
      </ExpandableBottomLayout.TopSection>
      <ExpandableBottomLayout.BottomSection backgroundColor={white}>
        {isNfcSheetOpen ? (
          <>
            <TextsContainer>
              <Title children="Ready to scan" />
              <BodyText textAlign="center">
                Hold your device near the NFC tag and stop moving when it
                vibrates.
              </BodyText>
            </TextsContainer>
            <Image
              h="$8"
              w="$8"
              alignSelf="center"
              borderRadius={1000}
              source={{
                uri: NFC_IMAGE,
              }}
              margin={20}
            />
          </>
        ) : (
          <>
            <TextsContainer>
              <GestureDetector gesture={devModeTap}>
                <XStack
                  justifyContent="space-between"
                  alignItems="center"
                  gap="$1.5"
                >
                  <Title>Verify your passport</Title>
                  <Button
                    unstyled
                    onPress={goToNFCTrouble}
                    icon={<CircleHelp size={28} color={slate500} />}
                    aria-label="Help"
                  />
                </XStack>
              </GestureDetector>
              <Description
                children={
                  isNfcEnabled
                    ? 'Open your passport to the last page to access the NFC chip. Place your phone against the page'
                    : dialogMessage
                }
              />
            </TextsContainer>
            <ButtonsContainer>
              <PrimaryButton
                trackEvent={
                  isNfcEnabled || !isNfcSupported
                    ? PassportEvents.START_PASSPORT_NFC
                    : PassportEvents.OPEN_NFC_SETTINGS
                }
                onPress={onVerifyPress}
                disabled={!isNfcSupported}
              >
                {isNfcEnabled || !isNfcSupported
                  ? 'Start Scan'
                  : 'Open settings'}
              </PrimaryButton>
              <SecondaryButton
                trackEvent={PassportEvents.CANCEL_PASSPORT_NFC}
                onPress={onCancelPress}
              >
                Cancel
              </SecondaryButton>
            </ButtonsContainer>
          </>
        )}
      </ExpandableBottomLayout.BottomSection>
    </ExpandableBottomLayout.Layout>
  );
};

export default PassportNFCScanScreen;

const styles = StyleSheet.create({
  animation: {
    color: slate100,
    width: '115%',
    height: '115%',
  },
});

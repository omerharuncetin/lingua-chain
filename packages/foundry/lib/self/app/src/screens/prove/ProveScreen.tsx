// SPDX-License-Identifier: BUSL-1.1; Copyright (c) 2025 Social Connect Labs, Inc.; Licensed under BUSL-1.1 (see LICENSE); Apache-2.0 from 2029-06-11

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SelfAppDisclosureConfig } from '@selfxyz/common';
import { formatEndpoint } from '@selfxyz/common';
import LottieView from 'lottie-react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Image, Text, View, YStack } from 'tamagui';

import miscAnimation from '../../assets/animations/loading/misc.json';
import { HeldPrimaryButtonProveScreen } from '../../components/buttons/HeldPrimaryButtonProveScreen';
import Disclosures from '../../components/Disclosures';
import { BodyText } from '../../components/typography/BodyText';
import { Caption } from '../../components/typography/Caption';
import { ProofEvents } from '../../consts/analytics';
import { ExpandableBottomLayout } from '../../layouts/ExpandableBottomLayout';
import { setDefaultDocumentTypeIfNeeded } from '../../providers/passportDataProvider';
import {
  ProofStatus,
  useProofHistoryStore,
} from '../../stores/proofHistoryStore';
import { useSelfAppStore } from '../../stores/selfAppStore';
import analytics from '../../utils/analytics';
import { black, slate300, white } from '../../utils/colors';
import { buttonTap } from '../../utils/haptic';
import { useProvingStore } from '../../utils/proving/provingMachine';

const { trackEvent } = analytics();

const ProveScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const isFocused = useIsFocused();
  const selectedApp = useSelfAppStore(state => state.selfApp);
  const selectedAppRef = useRef<typeof selectedApp>(null);

  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [scrollViewContentHeight, setScrollViewContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const isContentShorterThanScrollView = useMemo(
    () => scrollViewContentHeight <= scrollViewHeight,
    [scrollViewContentHeight, scrollViewHeight],
  );

  const provingStore = useProvingStore();
  const currentState = useProvingStore(state => state.currentState);
  const isReadyToProve = currentState === 'ready_to_prove';

  const { addProofHistory } = useProofHistoryStore();

  useEffect(() => {
    if (provingStore.uuid && selectedApp) {
      addProofHistory({
        appName: selectedApp.appName,
        sessionId: provingStore.uuid!,
        userId: selectedApp.userId,
        userIdType: selectedApp.userIdType,
        endpointType: selectedApp.endpointType,
        status: ProofStatus.PENDING,
        logoBase64: selectedApp.logoBase64,
        disclosures: JSON.stringify(selectedApp.disclosures),
      });
    }
  }, [provingStore.uuid, selectedApp]);

  useEffect(() => {
    if (isContentShorterThanScrollView) {
      setHasScrolledToBottom(true);
    } else {
      setHasScrolledToBottom(false);
    }
  }, [isContentShorterThanScrollView]);

  useEffect(() => {
    if (!isFocused || !selectedApp) {
      return;
    }

    setDefaultDocumentTypeIfNeeded();

    if (selectedAppRef.current?.sessionId !== selectedApp.sessionId) {
      console.log('[ProveScreen] Selected app updated:', selectedApp);
      provingStore.init('disclose');
    }
    selectedAppRef.current = selectedApp;
  }, [selectedApp, isFocused]);

  const disclosureOptions = useMemo(() => {
    return (selectedApp?.disclosures as SelfAppDisclosureConfig) || [];
  }, [selectedApp?.disclosures]);

  // Format the logo source based on whether it's a URL or base64 string
  const logoSource = useMemo(() => {
    if (!selectedApp?.logoBase64) {
      return null;
    }

    // Check if the logo is already a URL
    if (
      selectedApp.logoBase64.startsWith('http://') ||
      selectedApp.logoBase64.startsWith('https://')
    ) {
      return { uri: selectedApp.logoBase64 };
    }

    // Otherwise handle as base64 as before
    const base64String = selectedApp.logoBase64.startsWith('data:image')
      ? selectedApp.logoBase64
      : `data:image/png;base64,${selectedApp.logoBase64}`;
    return { uri: base64String };
  }, [selectedApp?.logoBase64]);

  const url = useMemo(() => {
    if (!selectedApp?.endpoint) {
      return null;
    }
    return formatEndpoint(selectedApp.endpoint);
  }, [selectedApp?.endpoint]);

  function onVerify() {
    provingStore.setUserConfirmed();
    buttonTap();
    trackEvent(ProofEvents.PROOF_VERIFICATION_STARTED, {
      appName: selectedApp?.appName,
      sessionId: provingStore.uuid,
      endpointType: selectedApp?.endpointType,
      userIdType: selectedApp?.userIdType,
    });
    setTimeout(() => {
      navigate('ProofRequestStatusScreen');
    }, 100);
  }

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (hasScrolledToBottom || isContentShorterThanScrollView) {
        return;
      }
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const paddingToBottom = 10;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
      if (isCloseToBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
        buttonTap();
        trackEvent(ProofEvents.PROOF_DISCLOSURES_SCROLLED, {
          appName: selectedApp?.appName,
          sessionId: provingStore.uuid,
        });
      }
    },
    [
      hasScrolledToBottom,
      isContentShorterThanScrollView,
      selectedApp,
      provingStore.uuid,
    ],
  );

  const handleContentSizeChange = useCallback(
    (contentWidth: number, contentHeight: number) => {
      setScrollViewContentHeight(contentHeight);
    },
    [],
  );

  const handleScrollViewLayout = useCallback((event: LayoutChangeEvent) => {
    setScrollViewHeight(event.nativeEvent.layout.height);
  }, []);

  return (
    <ExpandableBottomLayout.Layout flex={1} backgroundColor={black}>
      <ExpandableBottomLayout.TopSection backgroundColor={black}>
        <YStack alignItems="center">
          {!selectedApp?.sessionId ? (
            <LottieView
              source={miscAnimation}
              autoPlay
              loop
              resizeMode="cover"
              cacheComposition={true}
              renderMode="HARDWARE"
              style={styles.animation}
              speed={1}
              progress={0}
            />
          ) : (
            <YStack alignItems="center" justifyContent="center">
              {logoSource && (
                <Image
                  mb={20}
                  source={logoSource}
                  width={100}
                  height={100}
                  objectFit="contain"
                />
              )}
              <BodyText fontSize={12} color={slate300} mb={20}>
                {url}
              </BodyText>
              <BodyText fontSize={24} color={slate300} textAlign="center">
                <Text color={white}>{selectedApp.appName}</Text> is requesting
                that you prove the following information:
              </BodyText>
            </YStack>
          )}
        </YStack>
      </ExpandableBottomLayout.TopSection>
      <ExpandableBottomLayout.BottomSection
        paddingBottom={20}
        backgroundColor={white}
        maxHeight={'55%'}
      >
        <ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleScrollViewLayout}
        >
          <Disclosures disclosures={disclosureOptions} />

          {/* Display userDefinedData if it exists */}
          {selectedApp?.userDefinedData && (
            <View marginTop={20} paddingHorizontal={20}>
              <BodyText
                fontSize={16}
                color={black}
                fontWeight="600"
                marginBottom={10}
              >
                Additional Information:
              </BodyText>
              <View
                backgroundColor={slate300}
                padding={15}
                borderRadius={8}
                marginBottom={10}
              >
                <BodyText fontSize={14} color={black} lineHeight={20}>
                  {selectedApp.userDefinedData}
                </BodyText>
              </View>
            </View>
          )}

          <View marginTop={20}>
            <Caption
              textAlign="center"
              size="small"
              marginBottom={20}
              marginTop={10}
              borderRadius={4}
              paddingBottom={20}
            >
              Self will confirm that these details are accurate and none of your
              confidential info will be revealed to {selectedApp?.appName}
            </Caption>
          </View>
        </ScrollView>
        <HeldPrimaryButtonProveScreen
          onVerify={onVerify}
          selectedAppSessionId={selectedApp?.sessionId}
          hasScrolledToBottom={hasScrolledToBottom}
          isReadyToProve={isReadyToProve}
        />
      </ExpandableBottomLayout.BottomSection>
    </ExpandableBottomLayout.Layout>
  );
};

export default ProveScreen;

const styles = StyleSheet.create({
  animation: {
    top: 0,
    width: 200,
    height: 200,
    transform: [{ scale: 2 }, { translateY: -20 }],
  },
});

// SPDX-License-Identifier: BUSL-1.1; Copyright (c) 2025 Social Connect Labs, Inc.; Licensed under BUSL-1.1 (see LICENSE); Apache-2.0 from 2029-06-11

import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { Linking, Platform } from 'react-native';

import { SettingsEvents } from '../consts/analytics';
import { navigationRef } from '../navigation';
import { useSettingStore } from '../stores/settingStore';
import analytics from '../utils/analytics';
import { useModal } from './useModal';

const { trackEvent } = analytics();

const connectionModalParams = {
  titleText: 'Internet connection error',
  bodyText: 'In order to use SELF, you must have access to the internet.',
  buttonText: 'Open settings',
  secondaryButtonText: "Don't show again",
  onButtonPress: async () => {
    trackEvent(SettingsEvents.CONNECTION_SETTINGS_OPENED);
    return Platform.OS === 'ios'
      ? Linking.openURL('App-Prefs:root=Cellular')
      : Linking.sendIntent('android.settings.WIRELESS_SETTINGS');
  },
  onModalDismiss: () => {
    useSettingStore.getState().setHideNetworkModal(true);
  },
  preventDismiss: true,
} as const;

export default function useConnectionModal() {
  const { isConnected, isInternetReachable } = useNetInfo({
    reachabilityUrl: 'https://api.self.xyz/ping',
  });
  const { showModal, dismissModal, visible } = useModal(connectionModalParams);
  //isConnected and isInternetReachable can be null for unknown state
  const hasNoConnection =
    isConnected === false && isInternetReachable === false;
  const hideNetworkModal = useSettingStore(state => state.hideNetworkModal);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!navigationRef.isReady()) {
        return;
      }

      if (hasNoConnection && !visible && !hideNetworkModal) {
        showModal();
        trackEvent(SettingsEvents.CONNECTION_MODAL_OPENED);
      } else if (visible && !hasNoConnection) {
        dismissModal();
        trackEvent(SettingsEvents.CONNECTION_MODAL_CLOSED);
      }
      // Add a small delay to allow app initialization
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [hasNoConnection, dismissModal, visible, navigationRef.isReady()]);

  return {
    visible,
  };
}

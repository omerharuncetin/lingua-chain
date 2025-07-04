// SPDX-License-Identifier: BUSL-1.1; Copyright (c) 2025 Social Connect Labs, Inc.; Licensed under BUSL-1.1 (see LICENSE); Apache-2.0 from 2029-06-11

import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { ModalParams } from '../screens/misc/ModalScreen';

export const useModal = (params: ModalParams) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const showModal = useCallback(() => {
    setVisible(true);
    navigation.navigate('Modal', params);
  }, [params]);

  const dismissModal = useCallback(() => {
    setVisible(false);
    const routes = navigation.getState()?.routes;
    if (routes?.at(routes.length - 1)?.name === 'Modal') {
      navigation.goBack();
    }
    params.onModalDismiss();
  }, [params]);

  return {
    showModal,
    dismissModal,
    visible,
  };
};

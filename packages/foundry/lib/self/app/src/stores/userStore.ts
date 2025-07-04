// SPDX-License-Identifier: BUSL-1.1; Copyright (c) 2025 Social Connect Labs, Inc.; Licensed under BUSL-1.1 (see LICENSE); Apache-2.0 from 2029-06-11

import { DEFAULT_DOB, DEFAULT_DOE, DEFAULT_PNUMBER } from '@env';
import { create } from 'zustand';

interface UserState {
  passportNumber: string;
  dateOfBirth: string;
  dateOfExpiry: string;
  deepLinkName?: string;
  deepLinkSurname?: string;
  deepLinkNationality?: string;
  deepLinkBirthDate?: string;
  update: (patch: Partial<UserState>) => void;
  deleteMrzFields: () => void;
  setDeepLinkUserDetails: (details: {
    name?: string;
    surname?: string;
    nationality?: string;
    birthDate?: string;
  }) => void;
  clearDeepLinkUserDetails: () => void;
}

const useUserStore = create<UserState>((set, _get) => ({
  passportNumber: DEFAULT_PNUMBER ?? '',
  dateOfBirth: DEFAULT_DOB ?? '',
  dateOfExpiry: DEFAULT_DOE ?? '',
  deepLinkName: undefined,
  deepLinkSurname: undefined,
  deepLinkNationality: undefined,
  deepLinkBirthDate: undefined,

  update: patch => {
    set(state => ({ ...state, ...patch }));
  },

  deleteMrzFields: () =>
    set({
      passportNumber: '',
      dateOfBirth: '',
      dateOfExpiry: '',
    }),

  setDeepLinkUserDetails: details =>
    set({
      deepLinkName: details.name,
      deepLinkSurname: details.surname,
      deepLinkNationality: details.nationality,
      deepLinkBirthDate: details.birthDate,
    }),

  clearDeepLinkUserDetails: () =>
    set({
      deepLinkName: undefined,
      deepLinkSurname: undefined,
      deepLinkNationality: undefined,
      deepLinkBirthDate: undefined,
    }),
}));

export default useUserStore;

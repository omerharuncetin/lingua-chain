// SPDX-License-Identifier: BUSL-1.1; Copyright (c) 2025 Social Connect Labs, Inc.; Licensed under BUSL-1.1 (see LICENSE); Apache-2.0 from 2029-06-11

import { useNavigation } from '@react-navigation/native';
import { Check, Eraser } from '@tamagui/lucide-icons';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ScrollView, Spinner, Text, XStack, YStack } from 'tamagui';

import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { SecondaryButton } from '../../components/buttons/SecondaryButton';
import ButtonsContainer from '../../components/ButtonsContainer';
import { usePassport } from '../../providers/passportDataProvider';
import { borderColor, textBlack, white } from '../../utils/colors';
import { extraYPadding } from '../../utils/constants';
import { impactLight } from '../../utils/haptic';

interface ManageDocumentsScreenProps {}

const PassportDataSelector = () => {
  const {
    loadDocumentCatalog,
    getAllDocuments,
    deleteDocument,
    setSelectedDocument,
  } = usePassport();
  const [documentCatalog, setDocumentCatalog] = useState<any>({
    documents: [],
  });
  const [_allDocuments, setAllDocuments] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPassportDataInfo();
  }, []);

  const loadPassportDataInfo = async () => {
    setLoading(true);
    const catalog = await loadDocumentCatalog();
    const docs = await getAllDocuments();
    setDocumentCatalog(catalog);
    setAllDocuments(docs);
    setLoading(false);
  };

  const handleDocumentSelection = async (documentId: string) => {
    await setSelectedDocument(documentId);
    // Reload to update UI without loading state for quick operations
    const catalog = await loadDocumentCatalog();
    const docs = await getAllDocuments();
    setDocumentCatalog(catalog);
    setAllDocuments(docs);
  };

  const handleDeleteSpecific = async (documentId: string) => {
    setLoading(true);
    await deleteDocument(documentId);
    await loadPassportDataInfo();
  };

  const handleDeleteButtonPress = (documentId: string) => {
    Alert.alert(
      '⚠️ Delete Document ⚠️',
      'Are you sure you want to delete this document?\n\nThis document is already linked to your identity in Self Protocol and cannot be linked by another person.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await handleDeleteSpecific(documentId);
          },
        },
      ],
    );
  };

  const getDisplayName = (documentType: string): string => {
    switch (documentType) {
      case 'passport':
        return 'Passport';
      case 'mock_passport':
        return 'Mock Passport';
      case 'id_card':
        return 'ID Card';
      case 'mock_id_card':
        return 'Mock ID Card';
      default:
        return documentType;
    }
  };

  const getDocumentInfo = (metadata: any): string => {
    const countryCode =
      extractCountryFromData(metadata.data, metadata.documentCategory) ||
      'Unknown';
    return countryCode;
  };

  const extractCountryFromData = (
    data: string,
    documentCategory: string,
  ): string | null => {
    if (!data) return null;
    try {
      if (documentCategory === 'passport' || documentCategory === 'id_card') {
        if (data.length >= 5) {
          const countryCode = data.substring(2, 5); // Extract positions 2-4 from MRZ
          return countryCode;
        }
      } else if (documentCategory === 'aadhaar') {
        return 'IND';
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  if (loading) {
    return (
      <YStack gap="$3" ai="center" p="$4">
        <Text
          color={textBlack}
          fontWeight="bold"
          fontSize="$5"
          textAlign="center"
        >
          Available Documents
        </Text>
        <YStack gap="$3" ai="center" py="$6">
          <Spinner size="large" />
          <Text color={textBlack} fontSize="$4" opacity={0.7}>
            Loading documents...
          </Text>
        </YStack>
      </YStack>
    );
  }

  if (documentCatalog.documents.length === 0) {
    return (
      <YStack gap="$2" ai="center">
        <Text
          color={textBlack}
          fontWeight="bold"
          fontSize="$5"
          textAlign="center"
          mb="$3"
        >
          Available Documents
        </Text>
        <Text color={textBlack} fontSize="$4">
          No documents found
        </Text>
      </YStack>
    );
  }

  return (
    <YStack gap="$3" w="100%">
      <Text
        color={textBlack}
        fontWeight="bold"
        fontSize="$5"
        textAlign="center"
      >
        Available Documents
      </Text>
      {documentCatalog.documents.map((metadata: any) => (
        <YStack
          key={metadata.id}
          p="$3"
          borderWidth={1}
          borderColor={
            documentCatalog.selectedDocumentId === metadata.id
              ? textBlack
              : borderColor
          }
          borderRadius="$3"
          bg={
            documentCatalog.selectedDocumentId === metadata.id
              ? '$gray2'
              : 'white'
          }
          onPress={() => handleDocumentSelection(metadata.id)}
          pressStyle={{ opacity: 0.8 }}
        >
          <XStack ai="center" jc="space-between" mb="$2">
            <XStack ai="center" gap="$3" flex={1}>
              <Button
                size="$2"
                circular
                bg={
                  documentCatalog.selectedDocumentId === metadata.id
                    ? textBlack
                    : 'white'
                }
                borderColor={textBlack}
                borderWidth={1}
                onPress={() => handleDocumentSelection(metadata.id)}
              >
                {documentCatalog.selectedDocumentId === metadata.id && (
                  <Check size={12} color="white" />
                )}
              </Button>
              <YStack flex={1}>
                <Text color={textBlack} fontWeight="bold" fontSize="$4">
                  {getDisplayName(metadata.documentType)}
                </Text>
                <Text color={textBlack} fontSize="$3" opacity={0.7}>
                  {getDocumentInfo(metadata)}
                </Text>
              </YStack>
            </XStack>
            <Button
              bg="white"
              jc="center"
              borderColor={borderColor}
              borderWidth={1}
              size="$3"
              onPress={e => {
                e.stopPropagation();
                handleDeleteButtonPress(metadata.id);
              }}
            >
              <Eraser color={textBlack} size={16} />
            </Button>
          </XStack>
        </YStack>
      ))}
    </YStack>
  );
};

const ManageDocumentsScreen: React.FC<ManageDocumentsScreenProps> = ({}) => {
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();

  const handleScanDocument = () => {
    impactLight();
    navigation.navigate('PassportOnboarding' as any);
  };

  const handleGenerateMock = () => {
    impactLight();
    navigation.navigate('CreateMock' as any);
  };

  return (
    <YStack f={1} bg={white} px="$4" pb={bottom + extraYPadding}>
      <YStack gap="$6" py="$4" f={1}>
        <ScrollView showsVerticalScrollIndicator={false} flex={1}>
          <PassportDataSelector />
        </ScrollView>

        <YStack gap="$3" mt="$4">
          <Text
            color={textBlack}
            fontWeight="bold"
            fontSize="$5"
            textAlign="center"
            mb="$2"
          >
            Add New Document
          </Text>

          <ButtonsContainer>
            <PrimaryButton onPress={handleScanDocument}>
              Scan New ID Document
            </PrimaryButton>
            <SecondaryButton onPress={handleGenerateMock}>
              Generate Mock Document
            </SecondaryButton>
          </ButtonsContainer>
        </YStack>
      </YStack>
    </YStack>
  );
};

export default ManageDocumentsScreen;

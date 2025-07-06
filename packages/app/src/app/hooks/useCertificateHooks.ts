// packages/app/src/app/hooks/useCertificateHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { API_URL } from '../config';

// Types
export interface Certificate {
  id: string;
  userId: string;
  languageLevel: string;
  certificateUrl: string;
  tokenId?: string;
  issueDate: Date;
  transactionHash: string;
}

interface AwardCertificatePayload {
  languageLevel: string;
  certificateUrl: string;
  tokenId?: string;
}

interface GenericCertificateInfo {
  message: string;
  level: string;
  imageUrl: string;
}

const CERTIFICATE_QUERY_KEY_PREFIX = 'certificates';

// Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
});

// --- User-specific Certificate Hooks ---

// GET /api/users/:userId/certificates - Get all certificates for a user
export const useGetUserCertificates = (languageLevel?: string) => {
  const { address, isConnected } = useAccount();
  // Enable if connected and userId is provided.
  // Could add logic for 'me' to map to connected user's ID if needed.
  const enabled = isConnected && !!address;

  return useQuery<Certificate[], Error>({
    queryKey: [CERTIFICATE_QUERY_KEY_PREFIX, 'user', address, { languageLevel }],
    queryFn: async () => {
      if (!address) throw new Error('User ID is required');
      const { data } = await apiClient.get(`/api/users/${address}/certificates`, {
        params: { languageLevel },
      });
      return data;
    },
    enabled
  });
};

// POST /api/users/:userId/certificates - Award a certificate to a user
export const useAwardCertificate = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<Certificate, Error, { payload: AwardCertificatePayload }>({
    mutationFn: async ({ payload }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      const { data } = await apiClient.post(`/api/users/${address}/certificates`, payload);
      return data;
    },
    onSuccess: (awardedCertificate, variables) => {
      queryClient.invalidateQueries({ queryKey: [CERTIFICATE_QUERY_KEY_PREFIX, 'user', address] });
      queryClient.invalidateQueries({ queryKey: ['users', address] }); // If user object embeds certificates
    },
  });
};

// DELETE /api/users/:userId/certificates/:certificateId - Delete a specific certificate award
export const useDeleteUserCertificate = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<void, Error, { certificateId: string }>({
    mutationFn: async ({ certificateId }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      await apiClient.delete(`/api/users/${address}/certificates/${certificateId}`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [CERTIFICATE_QUERY_KEY_PREFIX, 'user', address] });
      queryClient.invalidateQueries({ queryKey: ['users', address] });
    },
  });
};

// --- Generic Certificate Info Hook ---

// GET /api/certificates/:level - Get generic certificate information for a level
export const useGetGenericCertificateInfo = (level?: string) => {
  return useQuery<GenericCertificateInfo, Error>({
    queryKey: [CERTIFICATE_QUERY_KEY_PREFIX, 'generic', level],
    queryFn: async () => {
      if (!level) throw new Error('Language level is required');
      const { data } = await apiClient.get(`/api/certificates/${level}`);
      return data;
    },
    enabled: !!level, // Only fetch if level is provided
  });
};

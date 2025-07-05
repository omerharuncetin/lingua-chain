// packages/app/src/app/hooks/useBadgeHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { API_URL } from '../config';

// Types
interface Badge {
  id: string;
  userId: string;
  languageLevel: string;
  badgeUrl?: string; // Based on sbtListenerService, might be generated
  tokenId?: string;  // Based on sbtListenerService
  issueDate: Date;
  // ... other badge fields
}

interface AwardBadgePayload {
  languageLevel: string;
  badgeAddress: string; // This comes from the backend's BlockchainService interaction
}

interface GenericBadgeInfo {
  message: string;
  level: string;
  imageUrl: string;
}

const BADGE_QUERY_KEY_PREFIX = 'badges';

// Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
});

// --- User-specific Badge Hooks ---

// GET /api/users/:userId/badges - Get all badges for a user
export const useGetUserBadges = (languageLevel?: string) => {
  const { address, isConnected } = useAccount();
  const enabled = isConnected && !!address; // 'me' could be a placeholder for connected user

  return useQuery<Badge[], Error>({
    queryKey: [BADGE_QUERY_KEY_PREFIX, 'user', address, { languageLevel }],
    queryFn: async () => {
      if (!address) throw new Error('User ID is required');
      // Replace 'me' with actual connected user's ID if that pattern is used.
      // For now, assuming userId is always specific or handled by backend if it's a general 'me'.

      const { data } = await apiClient.get(`/api/users/${address}/badges`, {
        params: { languageLevel },
      });
      return data;
    },
    enabled, // Only fetch if userId is provided
  });
};

// POST /api/users/:userId/badges - Award a badge to a user
export const useAwardBadge = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<Badge, Error, {payload: AwardBadgePayload }>({
    mutationFn: async ({ payload }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      // Optional: Add check if connected user is the one receiving the badge, if applicable
      const { data } = await apiClient.post(`/api/users/${address}/badges`, payload);
      return data;
    },
    onSuccess: (awardedBadge, variables) => {
      queryClient.invalidateQueries({ queryKey: [BADGE_QUERY_KEY_PREFIX, 'user', address] });
      // Potentially invalidate user query if badges are nested there
      queryClient.invalidateQueries({ queryKey: ['users', address] });
    },
  });
};

// DELETE /api/users/:userId/badges/:badgeId - Delete a specific badge award
export const useDeleteUserBadge = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<void, Error, { badgeId: string }>({
    mutationFn: async ({ badgeId }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      await apiClient.delete(`/api/users/${address}/badges/${badgeId}`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [BADGE_QUERY_KEY_PREFIX, 'user', address] });
      queryClient.invalidateQueries({ queryKey: ['users', address] });
    },
  });
};

// --- Generic Badge Info Hook ---

// GET /api/badges/:level - Get generic badge information for a level
export const useGetGenericBadgeInfo = (level?: string) => {
  // This is public info, so connection state might not be strictly necessary for enabling.
  return useQuery<GenericBadgeInfo, Error>({
    queryKey: [BADGE_QUERY_KEY_PREFIX, 'generic', level],
    queryFn: async () => {
      if (!level) throw new Error('Language level is required');
      const { data } = await apiClient.get(`/api/badges/${level}`);
      return data;
    },
    enabled: !!level, // Only fetch if level is provided
  });
};

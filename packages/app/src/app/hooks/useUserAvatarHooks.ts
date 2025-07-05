// packages/app/src/app/hooks/useUserAvatarHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { API_URL } from '../config';

// Types
// Assuming Avatar type is defined elsewhere or we define a basic one here
interface Avatar {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  // ... other avatar fields
}

interface UserAvatar {
  id: string; // This is the UserAvatar record ID
  userId: string;
  avatarId: string;
  purchaseDate: Date;
  avatar: Avatar; // Nested avatar details
}

interface RecordUserAvatarPayload {
  avatarId: string;
}

const USER_AVATAR_QUERY_KEY_PREFIX = 'userAvatars';

// Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
});

// GET /api/users/:userId/avatars - Get all avatars owned by a user
export const useGetUserAvatars = (userId?: string) => {
  const { address, isConnected } = useAccount();
  // Enable if connected and userId is provided.
  // Could add logic for 'me' to map to connected user's ID.
  const enabled = isConnected && !!userId;

  return useQuery<UserAvatar[], Error>({
    queryKey: [USER_AVATAR_QUERY_KEY_PREFIX, userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await apiClient.get(`/api/users/${userId}/avatars`);
      return data;
    },
    enabled: enabled,
  });
};

// POST /api/users/:userId/avatars - Record a user purchasing/owning an avatar
export const useRecordUserAvatar = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<UserAvatar, Error, { userId: string; payload: RecordUserAvatarPayload }>({
    mutationFn: async ({ userId, payload }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      // Optional: Check if the connected user matches userId if that's a requirement
      const { data } = await apiClient.post(`/api/users/${userId}/avatars`, payload);
      return data;
    },
    onSuccess: (newUserAvatar, variables) => {
      // Invalidate the list of user's avatars
      queryClient.invalidateQueries({ queryKey: [USER_AVATAR_QUERY_KEY_PREFIX, variables.userId] });
      // If user details query embeds their avatars, invalidate that too
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
    },
  });
};

// DELETE /api/users/:userId/avatars/:userAvatarId - Remove an avatar ownership entry
export const useDeleteUserAvatar = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<void, Error, { userId: string; userAvatarId: string }>({
    mutationFn: async ({ userId, userAvatarId }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      await apiClient.delete(`/api/users/${userId}/avatars/${userAvatarId}`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [USER_AVATAR_QUERY_KEY_PREFIX, variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
    },
  });
};

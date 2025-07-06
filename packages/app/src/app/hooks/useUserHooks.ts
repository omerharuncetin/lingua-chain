// packages/app/src/app/hooks/useUserHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { API_URL } from '../config';
import { Avatar } from './useAvatarHooks';
import { Certificate } from './useCertificateHooks';
import { Badge } from './useBadgeHooks';
import { DailyLessonRecord } from './useDailyLessonHooks';
import { UserProgress } from './useUserProgressHooks';

// Types (Ideally, these would be shared from a common types directory or generated from OpenAPI spec)
// For now, we'll define basic interfaces here.
interface User {
  id: string;
  walletAddress: string;
  username?: string;
  // ... other user fields from your Prisma schema
  progress?: UserProgress[];
  leaderboard?: any[];
  avatars?: Avatar[];
  certificates?: Certificate[];
  badges?: Badge[];
  equippedAvatar?: { avatar: Avatar };
  dailyLessonRecordToday?: DailyLessonRecord;
}

interface CreateUserPayload {
  walletAddress: string;
  username?: string;
}

interface UpdateUserPayload {
  username: string;
}

interface CompleteLessonPayload {
  languageLevel: string;
}

interface EquipAvatarPayload {
  userAvatarId: string;
}

const USER_QUERY_KEY = 'users';

// Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
});

// GET /api/users - Get all users (filterable by walletAddress)
export const useGetUsers = (walletAddress?: string) => {
  const { address: connectedWalletAddress, isConnected } = useAccount();
  return useQuery<User[], Error>({
    queryKey: [USER_QUERY_KEY, { walletAddress }],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/users', {
        params: { walletAddress },
      });
      return data;
    },
    enabled: isConnected, // Only fetch if user is connected
  });
};

// GET /api/users/:id - Get a specific user by ID
export const useGetUserById = () => {
  const { address, isConnected } = useAccount();
  return useQuery<User, Error>({
    queryKey: [USER_QUERY_KEY, address],
    queryFn: async () => {
      if (!address) throw new Error('User ID is required');
      const { data } = await apiClient.get(`/api/users/${address}`);
      return data;
    },
    enabled: isConnected && !!address, // Only fetch if connected and userId is provided
  });
};

// POST /api/users - Create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<User, Error, CreateUserPayload>({
    mutationFn: async (payload) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      // Ensure the payload's walletAddress matches the connected address if that's a requirement
      // Or, if walletAddress in payload can be different, adjust logic.
      // For creating a user, often the payload.walletAddress IS the new user's address.
      // Here, we assume payload.walletAddress is the one to create.
      const { data } = await apiClient.post('/api/users', payload);
      return data;
    },
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      // Optionally, update cache directly for the new user
      queryClient.setQueryData([USER_QUERY_KEY, newUser.id], newUser);
    },
    //onError: (error) => { console.error("Failed to create user:", error); }
  });
};

// PUT /api/users/:id - Update a user's username
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<User, Error, { payload: UpdateUserPayload }>({
    mutationFn: async ({ payload }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      // Optional: Check if the connected user is the one being updated
      // if (address !== userToUpdate.walletAddress) throw new Error("Unauthorized");
      const { data } = await apiClient.put(`/api/users/${address}`, payload);
      return data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, updatedUser.id] });
      queryClient.setQueryData([USER_QUERY_KEY, updatedUser.id], updatedUser);
    },
  });
};

// DELETE /api/users/:id - Delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<void, Error>({
    mutationFn: async () => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      await apiClient.delete(`/api/users/${address}`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, address] });
    },
  });
};

// POST /api/users/:userId/complete-lesson
export const useCompleteLesson = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<any, Error, { payload: CompleteLessonPayload }>({
    mutationFn: async ({ payload }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      const { data } = await apiClient.post(`/api/users/${address}/complete-lesson`, payload);
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate user data as it might include points, progress, daily limits
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, address] });
      // Invalidate leaderboard if lesson completion affects it
      queryClient.invalidateQueries({ queryKey: ['leaderboardEntries'] }); // Assuming 'leaderboardEntries' is a common key
      // Invalidate user progress
      queryClient.invalidateQueries({ queryKey: ['userProgress', address] });
    },
  });
};

// POST /api/users/:userId/equip-avatar
export const useEquipAvatar = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<any, Error, { payload: EquipAvatarPayload }>({
    mutationFn: async ({ payload }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      const { data } = await apiClient.post(`/api/users/${address}/equip-avatar`, payload);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, address] });
    },
  });
};

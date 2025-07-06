// packages/app/src/app/hooks/useUserProgressHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { API_URL } from '../config';

// Types
export interface UserProgress {
  id: string;
  userId: string;
  language: string;
  lesson: number;
  lastUpdated: Date;
}

interface CreateOrUpdateUserProgressPayload {
  language: string;
  lesson: number;
}

interface UpdateUserProgressPayload {
  lesson: number;
}

const USER_PROGRESS_QUERY_KEY_PREFIX = 'userProgress';

// Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
});

// GET /api/users/:userId/progress - Get all progress for a user
export const useGetUserProgressAll = () => {
  const { address, isConnected } = useAccount();
  const enabled = isConnected && !!address;

  return useQuery<UserProgress[], Error>({
    queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, address],
    queryFn: async () => {
      if (!address) throw new Error('User ID is required');
      const { data } = await apiClient.get(`/api/users/${address}/progress`);
      return data;
    },
    enabled: enabled,
  });
};

// GET /api/users/:userId/progress/:language - Get specific language progress for a user
export const useGetUserProgressByLanguage = (language?: string) => {
  const { address, isConnected } = useAccount();
  const enabled = isConnected && !!address && !!language;

  return useQuery<UserProgress, Error>({
    queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, address, language],
    queryFn: async () => {
      if (!address || !language) throw new Error('User ID and language are required');
      const { data } = await apiClient.get(`/api/users/${address}/progress/${language}`);
      return data;
    },
    enabled: enabled,
  });
};

// POST /api/users/:userId/progress - Create or update user progress for a language
export const useCreateOrUpdateUserProgress = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<UserProgress, Error, { payload: CreateOrUpdateUserProgressPayload }>({
    mutationFn: async ({ payload }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      const { data } = await apiClient.post(`/api/users/${address}/progress`, payload);
      return data;
    },
    onSuccess: (updatedProgress) => {
      queryClient.invalidateQueries({ queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, address] });
      queryClient.invalidateQueries({ queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, address, updatedProgress.language] });
      queryClient.setQueryData([USER_PROGRESS_QUERY_KEY_PREFIX, address, updatedProgress.language], updatedProgress);
      // If user details query embeds progress, invalidate that too
      queryClient.invalidateQueries({ queryKey: ['users', address] });
    },
  });
};

// PUT /api/users/:userId/progress/:language - Update user progress (e.g., advance lesson)
export const useUpdateUserProgress = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<UserProgress, Error, { language: string; payload: UpdateUserProgressPayload }>({
    mutationFn: async ({ language, payload }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      const { data } = await apiClient.put(`/api/users/${address}/progress/${language}`, payload);
      return data;
    },
    onSuccess: (updatedProgress, variables) => {
      queryClient.invalidateQueries({ queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, address] });
      queryClient.invalidateQueries({ queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, address, variables.language] });
      queryClient.setQueryData([USER_PROGRESS_QUERY_KEY_PREFIX, address, variables.language], updatedProgress);
      queryClient.invalidateQueries({ queryKey: ['users', address] });
    },
  });
};

// DELETE /api/users/:userId/progress/:language - Delete specific language progress
export const useDeleteUserProgress = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<void, Error, { language: string }>({
    mutationFn: async ({ language }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      await apiClient.delete(`/api/users/${address}/progress/${language}`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, address] });
      queryClient.invalidateQueries({ queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, address, variables.language] });
      queryClient.invalidateQueries({ queryKey: ['users', address] });
    },
  });
};

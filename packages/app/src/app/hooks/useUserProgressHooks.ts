// packages/app/src/app/hooks/useUserProgressHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { API_URL } from '../config';

// Types
interface UserProgress {
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
export const useGetUserProgressAll = (userId?: string) => {
  const { address, isConnected } = useAccount();
  const enabled = isConnected && !!userId;

  return useQuery<UserProgress[], Error>({
    queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await apiClient.get(`/api/users/${userId}/progress`);
      return data;
    },
    enabled: enabled,
  });
};

// GET /api/users/:userId/progress/:language - Get specific language progress for a user
export const useGetUserProgressByLanguage = (userId?: string, language?: string) => {
  const { address, isConnected } = useAccount();
  const enabled = isConnected && !!userId && !!language;

  return useQuery<UserProgress, Error>({
    queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, userId, language],
    queryFn: async () => {
      if (!userId || !language) throw new Error('User ID and language are required');
      const { data } = await apiClient.get(`/api/users/${userId}/progress/${language}`);
      return data;
    },
    enabled: enabled,
  });
};

// POST /api/users/:userId/progress - Create or update user progress for a language
export const useCreateOrUpdateUserProgress = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<UserProgress, Error, { userId: string; payload: CreateOrUpdateUserProgressPayload }>({
    mutationFn: async ({ userId, payload }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      const { data } = await apiClient.post(`/api/users/${userId}/progress`, payload);
      return data;
    },
    onSuccess: (updatedProgress, variables) => {
      queryClient.invalidateQueries({ queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, variables.userId] });
      queryClient.invalidateQueries({ queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, variables.userId, updatedProgress.language] });
      queryClient.setQueryData([USER_PROGRESS_QUERY_KEY_PREFIX, variables.userId, updatedProgress.language], updatedProgress);
      // If user details query embeds progress, invalidate that too
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
    },
  });
};

// PUT /api/users/:userId/progress/:language - Update user progress (e.g., advance lesson)
export const useUpdateUserProgress = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<UserProgress, Error, { userId: string; language: string; payload: UpdateUserProgressPayload }>({
    mutationFn: async ({ userId, language, payload }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      const { data } = await apiClient.put(`/api/users/${userId}/progress/${language}`, payload);
      return data;
    },
    onSuccess: (updatedProgress, variables) => {
      queryClient.invalidateQueries({ queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, variables.userId] });
      queryClient.invalidateQueries({ queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, variables.userId, variables.language] });
      queryClient.setQueryData([USER_PROGRESS_QUERY_KEY_PREFIX, variables.userId, variables.language], updatedProgress);
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
    },
  });
};

// DELETE /api/users/:userId/progress/:language - Delete specific language progress
export const useDeleteUserProgress = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  return useMutation<void, Error, { userId: string; language: string }>({
    mutationFn: async ({ userId, language }) => {
      if (!isConnected || !address) {
        throw new Error('User not connected');
      }
      await apiClient.delete(`/api/users/${userId}/progress/${language}`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, variables.userId] });
      queryClient.invalidateQueries({ queryKey: [USER_PROGRESS_QUERY_KEY_PREFIX, variables.userId, variables.language] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
    },
  });
};

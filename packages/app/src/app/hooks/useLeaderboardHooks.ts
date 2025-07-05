// packages/app/src/app/hooks/useLeaderboardHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAccount } from 'wagmi'; // To control mutations based on connection
import { API_URL } from '../config';

// Types
interface UserForLeaderboard {
  username?: string;
  walletAddress: string;
}

interface LeaderboardEntry {
  id: string;
  userId: string;
  language: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
  user: UserForLeaderboard;
}

interface LeaderboardResponse {
  data: LeaderboardEntry[];
  page: number;
  limit: number;
  totalPages: number;
  totalEntries: number;
}

interface CreateLeaderboardEntryPayload {
  userId: string;
  language: string;
  points: number;
}

interface UpdateLeaderboardEntryPayload {
  points: number;
}

const LEADERBOARD_QUERY_KEY = 'leaderboardEntries';

// Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
});

// GET /api/leaderboard - Get leaderboard entries
export const useGetLeaderboardEntries = (params?: {
  language?: string;
  sortBy?: 'points' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}) => {
  // Leaderboard is public, so connection status might not be needed for query enabling
  return useQuery<LeaderboardResponse, Error>({
    queryKey: [LEADERBOARD_QUERY_KEY, params],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/leaderboard', { params });
      return data;
    },
    // keepPreviousData: true, // Optional: for smoother pagination
  });
};

// GET /api/leaderboard/:id - Get a specific leaderboard entry by its own ID
export const useGetLeaderboardEntryById = (entryId?: string) => {
  return useQuery<LeaderboardEntry, Error>({
    queryKey: [LEADERBOARD_QUERY_KEY, entryId],
    queryFn: async () => {
      if (!entryId) throw new Error('Leaderboard entry ID is required');
      const { data } = await apiClient.get(`/api/leaderboard/${entryId}`);
      return data;
    },
    enabled: !!entryId,
  });
};

// POST /api/leaderboard - Add or update a leaderboard entry
export const useCreateOrUpdateLeaderboardEntry = () => {
  const queryClient = useQueryClient();
  const { isConnected } = useAccount();

  return useMutation<LeaderboardEntry, Error, CreateLeaderboardEntryPayload>({
    mutationFn: async (payload) => {
      if (!isConnected) throw new Error('User not connected. Cannot update leaderboard.');
      const { data } = await apiClient.post('/api/leaderboard', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADERBOARD_QUERY_KEY] });
    },
  });
};

// PUT /api/leaderboard/:id - Update a leaderboard entry's points
export const useUpdateLeaderboardEntry = () => {
  const queryClient = useQueryClient();
  const { isConnected } = useAccount();

  return useMutation<LeaderboardEntry, Error, { entryId: string; payload: UpdateLeaderboardEntryPayload }>({
    mutationFn: async ({ entryId, payload }) => {
      if (!isConnected) throw new Error('User not connected. Cannot update leaderboard entry.');
      const { data } = await apiClient.put(`/api/leaderboard/${entryId}`, payload);
      return data;
    },
    onSuccess: (updatedEntry) => {
      queryClient.invalidateQueries({ queryKey: [LEADERBOARD_QUERY_KEY] });
      // Optionally update the specific entry in cache
      queryClient.setQueryData([LEADERBOARD_QUERY_KEY, updatedEntry.id], updatedEntry);
    },
  });
};

// DELETE /api/leaderboard/:id - Delete a leaderboard entry
export const useDeleteLeaderboardEntry = () => {
  const queryClient = useQueryClient();
  const { isConnected } = useAccount();

  return useMutation<void, Error, string>({ // string is entryId
    mutationFn: async (entryId) => {
      if (!isConnected) throw new Error('User not connected. Cannot delete leaderboard entry.');
      // Usually, only admins would do this. The hook itself doesn't enforce role,
      // but the component calling it or the backend should.
      await apiClient.delete(`/api/leaderboard/${entryId}`);
    },
    onSuccess: (data, entryId) => {
      queryClient.invalidateQueries({ queryKey: [LEADERBOARD_QUERY_KEY] });
      // queryClient.removeQueries({ queryKey: [LEADERBOARD_QUERY_KEY, entryId] }); // Also an option
    },
  });
};

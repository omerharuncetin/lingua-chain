// packages/app/src/app/hooks/useAvatarHooks.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { API_URL } from '../config';

// Types
interface Avatar {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  lessons: number; // Assuming lessons is part of Avatar schema based on nftMetadataRoutes
  // ... other avatar fields
}

const AVATAR_QUERY_KEY = 'avatars';

// Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
});

// GET /api/avatars - Get all available avatars
export const useGetAvatars = () => {
  const { isConnected } = useAccount();
  return useQuery<Avatar[], Error>({
    queryKey: [AVATAR_QUERY_KEY],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/avatars');
      return data;
    },
    // Avatars can typically be fetched even if not connected,
    // unless there's a specific reason to restrict.
    // enabled: isConnected,
  });
};

// GET /api/avatars/:id - Get a specific avatar by ID
export const useGetAvatarById = (avatarId?: string) => {
  const { isConnected } = useAccount();
  return useQuery<Avatar, Error>({
    queryKey: [AVATAR_QUERY_KEY, avatarId],
    queryFn: async () => {
      if (!avatarId) throw new Error('Avatar ID is required');
      const { data } = await apiClient.get(`/api/avatars/${avatarId}`);
      return data;
    },
    enabled: !!avatarId, // Fetch if avatarId is provided
    // enabled: isConnected && !!avatarId, // If connection is also required
  });
};

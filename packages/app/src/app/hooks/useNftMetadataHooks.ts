// packages/app/src/app/hooks/useNftMetadataHooks.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
// import { useAccount } from 'wagmi'; // Not strictly needed if metadata is public
import { API_URL } from '../config';

// Basic NFT Metadata Type (adjust based on actual structure)
interface NftAttribute {
  trait_type: string;
  value: string | number;
}

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NftAttribute[];
  external_url?: string;
  // ... other metadata fields
}

const NFT_METADATA_QUERY_KEY_PREFIX = 'nftMetadata';

// Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
});

// GET /api/nft/badges/:level/:tokenId
export const useGetBadgeNftMetadata = (level?: string, tokenId?: string) => {
  return useQuery<NftMetadata, Error>({
    queryKey: [NFT_METADATA_QUERY_KEY_PREFIX, 'badge', level, tokenId],
    queryFn: async () => {
      if (!level || !tokenId) throw new Error('Level and Token ID are required');
      const { data } = await apiClient.get(`/api/nft/badges/${level.toLowerCase()}/${tokenId}`);
      return data;
    },
    enabled: !!level && !!tokenId,
  });
};

// GET /api/nft/certificates/:level/:tokenId
export const useGetCertificateNftMetadata = (level?: string, tokenId?: string) => {
  return useQuery<NftMetadata, Error>({
    queryKey: [NFT_METADATA_QUERY_KEY_PREFIX, 'certificate', level, tokenId],
    queryFn: async () => {
      if (!level || !tokenId) throw new Error('Level and Token ID are required');
      const { data } = await apiClient.get(`/api/nft/certificates/${level.toLowerCase()}/${tokenId}`);
      return data;
    },
    enabled: !!level && !!tokenId,
  });
};

// GET /api/nft/avatars/:avatar_slug/:tokenId
export const useGetAvatarNftMetadata = (avatarSlug?: string, tokenId?: string) => {
  return useQuery<NftMetadata, Error>({
    queryKey: [NFT_METADATA_QUERY_KEY_PREFIX, 'avatar', avatarSlug, tokenId],
    queryFn: async () => {
      if (!avatarSlug || !tokenId) throw new Error('Avatar slug and Token ID are required');
      const { data } = await apiClient.get(`/api/nft/avatars/${avatarSlug.toLowerCase()}/${tokenId}`);
      return data;
    },
    enabled: !!avatarSlug && !!tokenId,
  });
};

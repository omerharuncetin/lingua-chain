import { useState, useEffect } from 'react';

export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
        trait_type: string;
        value: string;
    }>;
}

export interface NFTMetadataState {
    data: NFTMetadata | null;
    loading: boolean;
    error: string | null;
}

export const useNFTMetadata = (metadataUrl: string | undefined): NFTMetadataState => {
    const [state, setState] = useState<NFTMetadataState>({
        data: null,
        loading: false,
        error: null
    });

    useEffect(() => {
        if (!metadataUrl) {
            setState({ data: null, loading: false, error: null });
            return;
        }

        const fetchMetadata = async () => {
            setState(prev => ({ ...prev, loading: true, error: null }));

            try {
                const response = await fetch(metadataUrl);

                if (!response.ok) {
                    throw new Error(`Failed to fetch metadata: ${response.status}`);
                }

                const metadata: NFTMetadata = await response.json();

                setState({
                    data: metadata,
                    loading: false,
                    error: null
                });
            } catch (error) {
                setState({
                    data: null,
                    loading: false,
                    error: error instanceof Error ? error.message : 'Failed to fetch metadata'
                });
            }
        };

        fetchMetadata();
    }, [metadataUrl]);

    return state;
};

// Hook to fetch multiple metadata URLs
export const useMultipleNFTMetadata = (metadataUrls: (string | undefined)[]): Record<string, NFTMetadataState> => {
    const [states, setStates] = useState<Record<string, NFTMetadataState>>({});

    useEffect(() => {
        const validUrls = metadataUrls.filter(url => url !== undefined) as string[];

        if (validUrls.length === 0) {
            setStates({});
            return;
        }

        const fetchAllMetadata = async () => {
            const newStates: Record<string, NFTMetadataState> = {};

            // Initialize loading states
            validUrls.forEach(url => {
                newStates[url] = { data: null, loading: true, error: null };
            });
            setStates(newStates);

            // Fetch all metadata concurrently
            const promises = validUrls.map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch metadata: ${response.status}`);
                    }
                    const metadata: NFTMetadata = await response.json();
                    return { url, data: metadata, error: null };
                } catch (error) {
                    return {
                        url,
                        data: null,
                        error: error instanceof Error ? error.message : 'Failed to fetch metadata'
                    };
                }
            });

            const results = await Promise.allSettled(promises);

            results.forEach((result, index) => {
                const url = validUrls[index];
                if (result.status === 'fulfilled') {
                    newStates[url] = {
                        data: result.value.data,
                        loading: false,
                        error: result.value.error
                    };
                } else {
                    newStates[url] = {
                        data: null,
                        loading: false,
                        error: 'Failed to fetch metadata'
                    };
                }
            });

            setStates(newStates);
        };

        fetchAllMetadata();
    }, [JSON.stringify(metadataUrls)]);

    return states;
};
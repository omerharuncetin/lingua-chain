// hooks/useAvatarMarketplace.ts
import { useState } from 'react';
import {
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    useAccount
} from 'wagmi';
import { parseUnits, formatUnits, erc20Abi, checksumAddress } from 'viem';
import { AVATAR_MARKETPLACE_ABI, CONTRACT_ADDRESSES } from '@/abis';
import { celoAlfajores } from 'viem/chains';
import { readContract } from 'viem/actions';

// Types
export interface AvatarMarketplaceInfo {
    index: number;
    price: bigint;
    available: boolean;
    nftContract: string;
}

export interface PurchaseState {
    isApproving: boolean;
    isPurchasing: boolean;
    isConfirming: boolean;
    error: string | null;
    approveHash: `0x${string}` | null;
    purchaseHash: `0x${string}` | null;
}

// Hook to get avatar marketplace info
export const useAvatarMarketplaceInfo = (index: number) => {
    const { data: price } = useReadContract({
        address: CONTRACT_ADDRESSES.AVATAR_MARKETPLACE,
        abi: AVATAR_MARKETPLACE_ABI,
        functionName: 'prices',
        args: [BigInt(index)],
    });

    const { data: available } = useReadContract({
        address: CONTRACT_ADDRESSES.AVATAR_MARKETPLACE,
        abi: AVATAR_MARKETPLACE_ABI,
        functionName: 'available',
        args: [BigInt(index)],
    });

    const { data: nftContract } = useReadContract({
        address: CONTRACT_ADDRESSES.AVATAR_MARKETPLACE,
        abi: AVATAR_MARKETPLACE_ABI,
        functionName: 'nftContracts',
        args: [BigInt(index)],
    });

    return {
        price: price || BigInt(0),
        available: available || false,
        nftContract: nftContract || '',
        priceFormatted: price ? formatUnits(price, 6) : '0', // USDC has 6 decimals
    };
};

// Hook to get all avatars info
export const useAllAvatarsInfo = () => {
    const avatar0 = useAvatarMarketplaceInfo(0);
    const avatar1 = useAvatarMarketplaceInfo(1);
    const avatar2 = useAvatarMarketplaceInfo(2);
    const avatar3 = useAvatarMarketplaceInfo(3);
    const avatar4 = useAvatarMarketplaceInfo(4);

    return [avatar0, avatar1, avatar2, avatar3, avatar4];
};

// Hook to get user's USDC balance
export const useUSDCBalance = () => {
    const { address, connector } = useAccount();

    console.log('sending', address);

    const { data: balance } = useReadContract({
        address: CONTRACT_ADDRESSES.USDC,
        abi: erc20Abi,
        chainId: celoAlfajores.id,
        functionName: 'balanceOf',
        args: address ? [checksumAddress(address, celoAlfajores.id)] : undefined,
        query: {
            enabled: !!address,
        },
        account: address
    });
    if (connector && connector.getClient && address) {
        connector.getClient().then((client) => {
            readContract(client, {
                address: CONTRACT_ADDRESSES.USDC,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [checksumAddress(address, celoAlfajores.id)],
                account: address
            }).then((testBalance) => console.log({ testBalance }))
        })


    }

    console.log({ balance })

    return {
        balance: balance || BigInt(0),
        balanceFormatted: balance ? formatUnits(balance, 6) : '0',
    };
};

// Hook to get USDC allowance for marketplace
export const useUSDCAllowance = () => {
    const { address } = useAccount();

    const { data: allowance, refetch } = useReadContract({
        address: CONTRACT_ADDRESSES.USDC,
        abi: erc20Abi,
        functionName: 'allowance',
        args: address ? [address, CONTRACT_ADDRESSES.AVATAR_MARKETPLACE] : undefined,
        query: {
            enabled: !!address,
        },
    });

    return {
        allowance: allowance || BigInt(0),
        allowanceFormatted: allowance ? formatUnits(allowance, 6) : '0',
        refetch,
    };
};

// Hook to approve USDC spending
export const useApproveUSDC = () => {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const approve = async (amount: string) => {
        const amountWei = parseUnits(amount, 6); // USDC has 6 decimals

        return writeContract({
            address: CONTRACT_ADDRESSES.USDC,
            abi: erc20Abi,
            functionName: 'approve',
            args: [CONTRACT_ADDRESSES.AVATAR_MARKETPLACE, amountWei],
        });
    };

    return {
        approve,
        hash,
        isPending,
        isConfirming,
        isConfirmed,
        error,
    };
};

// Hook to purchase avatar
export const usePurchaseAvatar = () => {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const purchase = async (index: number) => {
        return writeContract({
            address: CONTRACT_ADDRESSES.AVATAR_MARKETPLACE,
            abi: AVATAR_MARKETPLACE_ABI,
            functionName: 'buy',
            args: [BigInt(index)],
        });
    };

    return {
        purchase,
        hash,
        isPending,
        isConfirming,
        isConfirmed,
        error,
    };
};

// Combined hook for complete purchase flow
export const useAvatarPurchaseFlow = () => {
    const [purchaseState, setPurchaseState] = useState<PurchaseState>({
        isApproving: false,
        isPurchasing: false,
        isConfirming: false,
        error: null,
        approveHash: null,
        purchaseHash: null,
    });

    //const { balance } = useUSDCBalance();
    const { allowance, refetch: refetchAllowance } = useUSDCAllowance();
    const approveUSDC = useApproveUSDC();
    const purchaseAvatar = usePurchaseAvatar();

    const resetState = () => {
        setPurchaseState({
            isApproving: false,
            isPurchasing: false,
            isConfirming: false,
            error: null,
            approveHash: null,
            purchaseHash: null,
        });
    };

    const purchaseAvatarWithApproval = async (index: number, price: string) => {
        try {
            resetState();
            const priceWei = parseUnits(price, 6);

            // Check if user has enough balance
            // if (balance < priceWei) {
            //     throw new Error('Insufficient USDC balance');
            // }

            // Check if approval is needed
            if (allowance < priceWei) {
                setPurchaseState(prev => ({ ...prev, isApproving: true }));

                // Approve USDC spending
                await approveUSDC.approve(price);

                setPurchaseState(prev => ({
                    ...prev,
                    approveHash: approveUSDC.hash || null,
                    isConfirming: true
                }));
                let maxTry = 10;

                // Wait for approval confirmation
                while (!approveUSDC.isConfirmed && maxTry > 0) {
                    console.log(approveUSDC)
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    maxTry--;
                }

                // Refetch allowance to confirm approval
                await refetchAllowance();

                setPurchaseState(prev => ({
                    ...prev,
                    isApproving: false,
                    isConfirming: false
                }));
            }

            // Purchase avatar
            setPurchaseState(prev => ({ ...prev, isPurchasing: true }));

            await purchaseAvatar.purchase(index);

            setPurchaseState(prev => ({
                ...prev,
                purchaseHash: purchaseAvatar.hash || null,
                isConfirming: true
            }));
            let maxTry = 7;
            // Wait for purchase confirmation
            while (!purchaseAvatar.isConfirmed && maxTry > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                maxTry--;
            }

            setPurchaseState(prev => ({
                ...prev,
                isPurchasing: false,
                isConfirming: false
            }));

            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Purchase failed';
            setPurchaseState(prev => ({
                ...prev,
                error: errorMessage,
                isApproving: false,
                isPurchasing: false,
                isConfirming: false
            }));
            return false;
        }
    };

    const isLoading = purchaseState.isApproving || purchaseState.isPurchasing || purchaseState.isConfirming;

    return {
        purchaseState,
        isLoading,
        purchaseAvatarWithApproval,
        resetState,
        allowance,
    };
};

// Hook to check if user can afford avatar
export const useCanAffordAvatar = (price: string) => {
    const { balance } = useUSDCBalance();
    const priceWei = parseUnits(price, 6);

    return {
        canAfford: balance >= priceWei,
        balance,
        balanceFormatted: formatUnits(balance, 6),
        needed: priceWei > balance ? formatUnits(priceWei - balance, 6) : '0',
    };
};
"use client"

import { useState, useMemo } from "react";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import AvatarTabs from "@/components/marketplace/AvatarTabs";
import { useRouter } from "next/navigation";
import { useGetAvatars } from "../hooks/useAvatarHooks";
import { useGetUserAvatars } from "../hooks/useUserAvatarHooks";
import { useGetUserById, useEquipAvatar } from "../hooks/useUserHooks";
import { useAccount } from "wagmi";
import {
    useUSDCBalance,
    useAvatarPurchaseFlow,
    useAllAvatarsInfo
} from "../hooks/useAvatarMarketplaceHooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Wallet, Loader2, CheckCircle, X } from "lucide-react";
import { toast } from "sonner"; // Optional: for notifications

const Marketplace = () => {
    const navigate = useRouter();
    const { address, isConnected } = useAccount();

    // Blockchain data
    const balanceFormatted = '10.0';

    const avatarsBlockchainInfo = useAllAvatarsInfo();
    const {
        purchaseState,
        isLoading: isPurchasing,
        purchaseAvatarWithApproval,
        resetState
    } = useAvatarPurchaseFlow();

    // API data
    const avatarsResponse = useGetAvatars();
    const userAvatarsResponse = useGetUserAvatars();
    const currentUser = useGetUserById();
    const equipMutation = useEquipAvatar();

    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [hoveredAvatar, setHoveredAvatar] = useState<string | null>(null);
    const [purchasingAvatarId, setPurchasingAvatarId] = useState<string | null>(null);

    // Derive data from API responses
    const allAvatars = avatarsResponse.data?.sort((a, b) => a.blockchainIndex - b.blockchainIndex) || [];
    const userAvatars = userAvatarsResponse.data || [];

    // Extract owned avatars (from userAvatars, get the avatar details)
    const ownedAvatars = useMemo(() => {
        return userAvatars
            .map(userAvatar => {
                // Find the corresponding avatar from allAvatars
                return allAvatars.find(avatar => avatar.id === userAvatar.avatarId);
            })
            .filter(avatar => avatar !== undefined);
    }, [allAvatars, userAvatars]);

    // Extract available avatars (not owned)
    const availableAvatars = useMemo(() => {
        const ownedAvatarIds = userAvatars.map(userAvatar => userAvatar.avatarId);
        return allAvatars.filter(avatar => !ownedAvatarIds.includes(avatar.id));
    }, [allAvatars, userAvatars]);

    // Find equipped avatar ID
    const equippedAvatarId = useMemo(() => {
        const equippedUserAvatar = currentUser.data?.equippedAvatar;
        return equippedUserAvatar?.avatar.id || null;
    }, [currentUser]);

    const handlePurchase = async (avatarId: string) => {
        try {
            setPurchasingAvatarId(avatarId);

            // Find avatar data
            const avatar = allAvatars.find(a => a.id === avatarId);
            if (!avatar) {
                throw new Error('Avatar not found');
            }

            // Get blockchain info for this avatar
            // const blockchainInfo = avatarsBlockchainInfo[avatar.blockchainIndex];
            // if (!blockchainInfo?.available) {
            //     throw new Error('Avatar not available on blockchain');
            // }

            // Execute blockchain purchase
            const success = await purchaseAvatarWithApproval(
                avatar.blockchainIndex,
                '0.000001'
            );

            if (success) {
                // Purchase successful - now sync with backend
                try {
                    // Call your backend API to sync the NFT purchase
                    // This should create a UserAvatar entry in your database
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // Refresh data
                    await Promise.all([
                        avatarsResponse.refetch(),
                        userAvatarsResponse.refetch(),
                        currentUser.refetch()
                    ]);

                    // Show success message
                    toast?.success?.(`Successfully purchased ${avatar.name}!`);
                } catch (backendError) {
                    console.error('Backend sync failed:', backendError);
                    toast?.warning?.('Purchase successful on blockchain, but failed to sync with backend. Please contact support.');
                }
            }
        } catch (error) {
            console.error('Purchase failed:', error);
            toast?.error?.(error instanceof Error ? error.message : 'Purchase failed');
        } finally {
            setPurchasingAvatarId(null);
        }
    };

    const handleEquip = async (avatarId: string) => {
        try {
            // Find the UserAvatar entry for this avatar
            const userAvatar = userAvatars.find(ua => ua.avatarId === avatarId);
            if (!userAvatar) {
                throw new Error('Avatar not owned');
            }

            await equipMutation.mutateAsync({
                payload: { userAvatarId: userAvatar.id }
            });

            // Refresh user data to get updated equipped avatar
            await currentUser.refetch();

            toast?.success?.('Avatar equipped successfully!');
        } catch (error) {
            console.error('Equip failed:', error);
            toast?.error?.(error instanceof Error ? error.message : 'Failed to equip avatar');
        }
    };

    // Show wallet connection prompt if not connected
    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0E0E10] via-[#1a1a1c] to-[#0E0E10] text-white flex items-center justify-center relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 max-w-md mx-auto px-6">
                    <Card className="p-8 text-center bg-slate-900/80 backdrop-blur-xl border border-slate-700/60">
                        <Wallet className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
                        <p className="text-slate-400 mb-6">
                            Connect your wallet to purchase avatars with USDC on the blockchain
                        </p>
                        <Button
                            onClick={() => navigate.push("/dashboard")}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                        >
                            <Wallet className="w-4 h-4 mr-2" />
                            Go to Dashboard
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0E0E10] via-[#1a1a1c] to-[#0E0E10] text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
                {/* Purchase Status Overlay */}
                {isPurchasing && purchasingAvatarId && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <Card className="p-6 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 max-w-md w-full mx-4">
                            <div className="text-center">
                                <div className="mb-4">
                                    {purchaseState.isApproving && (
                                        <div className="flex items-center justify-center space-x-3">
                                            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                                            <div>
                                                <h3 className="font-semibold text-white">Approving USDC</h3>
                                                <p className="text-sm text-slate-400">Please confirm in your wallet</p>
                                            </div>
                                        </div>
                                    )}

                                    {purchaseState.isPurchasing && (
                                        <div className="flex items-center justify-center space-x-3">
                                            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                                            <div>
                                                <h3 className="font-semibold text-white">Purchasing Avatar</h3>
                                                <p className="text-sm text-slate-400">Transaction in progress...</p>
                                            </div>
                                        </div>
                                    )}

                                    {purchaseState.isConfirming && (
                                        <div className="flex items-center justify-center space-x-3">
                                            <Loader2 className="w-8 h-8 animate-spin text-green-400" />
                                            <div>
                                                <h3 className="font-semibold text-white">Confirming Transaction</h3>
                                                <p className="text-sm text-slate-400">Waiting for blockchain confirmation</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Transaction Hashes */}
                                {(purchaseState.approveHash || purchaseState.purchaseHash) && (
                                    <div className="space-y-2 mb-4">
                                        {purchaseState.approveHash && (
                                            <div className="flex items-center space-x-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span className="text-slate-300">Approval: {purchaseState.approveHash.slice(0, 10)}...</span>
                                            </div>
                                        )}
                                        {purchaseState.purchaseHash && (
                                            <div className="flex items-center space-x-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span className="text-slate-300">Purchase: {purchaseState.purchaseHash.slice(0, 10)}...</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Error Display */}
                                {purchaseState.error && (
                                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                                        <div className="flex items-center space-x-2 text-red-400 text-sm">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span>{purchaseState.error}</span>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={() => {
                                        resetState();
                                        setPurchasingAvatarId(null);
                                    }}
                                    variant="outline"
                                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                <MarketplaceHeader
                    userUSDC={parseFloat(balanceFormatted)}
                    onNavigateBack={() => navigate.push("/dashboard")}
                />

                <AvatarTabs
                    avatars={allAvatars}
                    ownedAvatars={ownedAvatars}
                    availableAvatars={availableAvatars}
                    equippedAvatarId={equippedAvatarId}
                    userUSDC={parseFloat(balanceFormatted)}
                    selectedAvatar={selectedAvatar}
                    hoveredAvatar={hoveredAvatar}
                    onPurchase={handlePurchase}
                    onEquip={handleEquip}
                    onSelect={setSelectedAvatar}
                    onHover={setHoveredAvatar}
                />
            </div>
        </div>
    );
};

export default Marketplace;
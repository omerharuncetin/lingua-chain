"use client"


import { Card } from '@/components/ui/card';
import { Users, Trophy, Wallet, Star, Shield, Zap } from 'lucide-react';
import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

export default function Home() {
  const { open } = useAppKit();
  const { isConnecting } = useAccount();

  const handleConnectWallet = async (walletType: string) => {
    open();
  };

  return (
    // Apply dark theme here using Tailwind's "dark" class. 
    <div className="dark min-h-screen bg-gradient-to-br from-[#101622] via-[#1b2432] to-[#11141c] text-white relative overflow-hidden font-sans">
      {/* Animated background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-0 top-0 w-80 h-80 bg-gradient-to-tr from-cyan-800/30 via-blue-800/20 to-sky-600/20 rounded-full blur-3xl opacity-35"></div>
        <div className="absolute right-0 top-0 w-96 h-72 bg-gradient-to-br from-purple-700/25 to-fuchsia-700/10 rounded-full blur-3xl opacity-35"></div>
        <div className="absolute left-0 bottom-0 w-72 h-72 bg-gradient-to-br from-pink-900/25 via-purple-700/10 to-yellow-600/5 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 pt-16 pb-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mt-4 mb-20 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-tr from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-xl mb-2 pb-2 font-sans">
            Lingua<span className="font-serif italic tracking-tight">Chain</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-200 mb-5 tracking-tight">
            Master English. Earn Tokens. Prove It On-Chain.
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
            Become fluent with blockchain-verified achievements and real token rewards in a global learning community.
          </p>

          {/* <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mb-14">
            <Card className="p-4 transition border-0 bg-slate-900/90 dark:bg-slate-900/90 text-yellow-100/90 drop-shadow-lg rounded-2xl">
              <div className="flex items-center justify-center space-x-3">
                <Coins className="w-8 h-8 text-yellow-400" />
                <div>
                  <div className="font-bold text-2xl text-yellow-400">50,000+</div>
                  <div className="text-sm text-yellow-200/80">Tokens Earned</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 transition border-0 bg-slate-900/90 dark:bg-slate-900/90 text-purple-100 drop-shadow-lg rounded-2xl">
              <div className="flex items-center justify-center space-x-3">
                <Users className="w-8 h-8 text-purple-400" />
                <div>
                  <div className="font-bold text-2xl text-purple-400">10,000+</div>
                  <div className="text-sm text-purple-200/80">Active Learners</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 transition border-0 bg-slate-900/90 dark:bg-slate-900/90 text-green-100 drop-shadow-lg rounded-2xl">
              <div className="flex items-center justify-center space-x-3">
                <Trophy className="w-8 h-8 text-green-400" />
                <div>
                  <div className="font-bold text-2xl text-green-400">5,000+</div>
                  <div className="text-sm text-green-200/80">Certificates</div>
                </div>
              </div>
            </Card>
          </div> */}
        </div>

        {/* Wallet Connection Section */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
          <Card className="p-7 bg-gradient-to-br from-orange-900/60 to-orange-600/20 border-0 drop-shadow-md hover:scale-105 transition-all duration-200 cursor-pointer group rounded-2xl"
            onClick={() => handleConnectWallet('metamask')}>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">MetaMask</h3>
              <p className="text-slate-300 text-center">Connect with MetaMask wallet</p>
              <div className="flex items-center space-x-1 text-orange-300">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold">Most Popular</span>
              </div>
            </div>
          </Card>
          <Card className="p-7 bg-gradient-to-br from-blue-900/60 to-blue-600/20 border-0 drop-shadow-md hover:scale-105 transition-all duration-200 cursor-pointer group rounded-2xl"
            onClick={() => handleConnectWallet('walletconnect')}>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">WalletConnect</h3>
              <p className="text-slate-300 text-center">Connect with any wallet</p>
              <div className="flex items-center space-x-1 text-blue-300">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">Universal</span>
              </div>
            </div>
          </Card>
        </div>

        {isConnecting && (
          <div className="flex items-center justify-center mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <span className="ml-3 text-slate-200 font-medium">Connecting wallet...</span>
          </div>
        )}

        {/* Why Connect Info */}
        <Card className="p-6 bg-slate-900/95 border-0 drop-shadow-xl max-w-md mx-auto rounded-2xl">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <h4 className="font-bold text-white mb-1">Why connect?</h4>
              <p className="text-sm text-slate-300">
                Track your progress, earn real rewards, and mint blockchain-verified certificates that demonstrate your language mastery.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight font-sans pb-2">
          Why Choose LinguaChain?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-10 bg-slate-900/80 border-0 drop-shadow-xl hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-300/10 rounded-2xl">
            <Trophy className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-white">Earn While Learning</h3>
            <p className="text-slate-300 text-base">Complete lessons to earn LingoCoins and unlock rare NFT avatars powered by real utility.</p>
          </Card>
          <Card className="p-10 bg-slate-900/80 border-0 drop-shadow-xl hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/10 rounded-2xl">
            <Shield className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-white">Prove Your Progress</h3>
            <p className="text-slate-300 text-base">Mint soulbound certificates that permanently verify your skills on-chain, truly owned by you.</p>
          </Card>
          <Card className="p-10 bg-slate-900/80 border-0 drop-shadow-xl hover:scale-105 transition-all duration-200 shadow-lg shadow-green-500/10 rounded-2xl">
            <Users className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-white">Join the Community</h3>
            <p className="text-slate-300 text-base">Climb global leaderboards and connect with passionate learners across the world.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

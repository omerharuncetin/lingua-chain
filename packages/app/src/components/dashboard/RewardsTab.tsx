
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserStats {
  coins: number;
  streak: number;
}

interface RewardsTabProps {
  userStats: UserStats;
}

const RewardsTab = ({ userStats }: RewardsTabProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white">Token Rewards</h3>
      
      <Card className="p-6 bg-slate-900/70 border border-slate-700/50 backdrop-blur-xl rounded-2xl">
        <h4 className="font-bold mb-4 text-white">Convert LingoCoins to USDC</h4>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Available:</span>
            <span className="text-white">{userStats.coins} LingoCoins</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-slate-300">Value:</span>
            <span className="text-white">~${(userStats.coins * 0.01).toFixed(2)} USDC</span>
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
          <p className="text-xs text-yellow-200">
            ⚠️ You can only convert tokens after completing daily lessons consistently for 5 days.
            Current streak: {userStats.streak} days.
          </p>
        </div>
        <Button 
          disabled={userStats.streak < 5}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-400/25 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none rounded-xl"
        >
          Convert to USDC
        </Button>
      </Card>
    </div>
  );
};

export default RewardsTab;

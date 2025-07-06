
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, DollarSign, ShoppingBag } from "lucide-react";

interface MarketplaceHeaderProps {
  userUSDC: number;
  onNavigateBack: () => void;
}

const MarketplaceHeader = ({ userUSDC, onNavigateBack }: MarketplaceHeaderProps) => {
  return (
    <div className="relative">
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-96 h-20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative flex items-center justify-between mb-12 p-6 bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/60">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onNavigateBack}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <ShoppingBag className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00FFA3] to-[#FFD700] bg-clip-text text-transparent drop-shadow-lg">
                Avatar Marketplace
              </h1>
              <p className="text-slate-300 text-base md:text-lg font-medium">Upgrade your learning companion</p>
            </div>
          </div>
        </div>
        
        {/* Enhanced USDC Display */}
        <Card className="relative px-8 py-4 bg-gradient-to-br from-green-400/80 via-emerald-500/70 to-green-600/80 border-2 border-green-300/80 backdrop-blur-xl rounded-xl shadow-2xl shadow-green-500/40 group hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-xl blur-lg opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute inset-0 border-2 border-green-200/40 rounded-xl"></div>
          <div className="relative flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-green-300/90 border-2 border-green-200/90 shadow-lg">
              <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-green-900 group-hover:animate-pulse" />
            </div>
            <div>
              <span className="font-black text-2xl md:text-3xl text-white drop-shadow-lg">
                {userUSDC.toLocaleString()}
              </span>
              <p className="text-sm text-green-100 font-bold">USDC</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MarketplaceHeader;

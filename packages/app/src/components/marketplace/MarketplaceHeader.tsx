
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";

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
      </div>
    </div>
  );
};

export default MarketplaceHeader;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, DollarSign, Lock, Sparkles, Trophy, ShoppingBag } from "lucide-react";
import { Avatar } from "@/app/hooks/useAvatarHooks";
import { API_URL } from "@/app/config";

interface AvatarCardProps {
  avatar: Avatar;
  userUSDC: number;
  selectedAvatar: string | null;
  hoveredAvatar: string | null;
  equipped: boolean;
  owned: boolean; // Added owned prop as well
  onPurchase: (avatarId: string) => void;
  onEquip: (avatarId: string) => void;
  onSelect: (avatarId: string | null) => void;
  onHover: (avatarId: string | null) => void;
}

const AvatarCard = ({
  avatar,
  userUSDC,
  selectedAvatar,
  hoveredAvatar,
  equipped,
  owned,
  onPurchase,
  onEquip,
  onSelect,
  onHover
}: AvatarCardProps) => {
  const getCardStyle = () => {
    let baseStyle = "group relative p-6 transition-all duration-500 cursor-pointer backdrop-blur-xl border-2 rounded-xl overflow-hidden min-h-96 ";

    if (equipped) {
      baseStyle += "bg-slate-800/95 border-emerald-400/70 shadow-xl shadow-emerald-500/20 ";
      if (hoveredAvatar === avatar.id) baseStyle += "scale-105 -translate-y-1 shadow-2xl shadow-emerald-500/30";
    } else if (owned) {
      baseStyle += "bg-slate-800/95 border-blue-500/60 hover:border-blue-400/80 ";
      if (hoveredAvatar === avatar.id) baseStyle += "scale-105 shadow-xl shadow-blue-500/20 -translate-y-1";
    } else if (userUSDC >= avatar.price) {
      baseStyle += "bg-slate-800/95 border-purple-500/60 hover:border-purple-400/80 ";
      if (hoveredAvatar === avatar.id) baseStyle += "scale-105 shadow-xl shadow-purple-500/20 -translate-y-1";
    } else {
      baseStyle += "bg-slate-800/70 border-slate-600/50 opacity-80";
    }

    return baseStyle;
  };

  return (
    <Card
      className={getCardStyle()}
      onClick={() => onSelect(selectedAvatar === avatar.id ? null : avatar.id)}
      onMouseEnter={() => onHover(avatar.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Card glow effects */}
      {equipped && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/15 to-green-500/15 rounded-xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-500"></div>
      )}
      {!equipped && owned && hoveredAvatar === avatar.id && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-xl blur-xl -z-10 transition-all duration-500"></div>
      )}

      <div className="text-center relative z-10 h-full flex flex-col">
        <div className="relative mb-4">
          <div className="w-20 h-20 text-4xl mx-auto bg-gradient-to-br from-slate-700/80 to-slate-600/80 rounded-xl flex items-center justify-center mb-3 border border-slate-500/60 group-hover:scale-110 transition-transform duration-300">
            <img src={API_URL + avatar.imageUrl} className="w-20 h-20 rounded-lg" />
          </div>
          {equipped && (
            <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500/90 to-green-500/90 text-white border border-emerald-400/90 backdrop-blur-sm shadow-lg shadow-emerald-500/40 text-xs font-bold">
              <Check className="w-3 h-3 mr-1" />
              Equipped
            </Badge>
          )}
          {owned && !equipped && (
            <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500/90 to-cyan-500/90 text-white border border-blue-400/90 backdrop-blur-sm text-xs font-bold">
              <Trophy className="w-3 h-3 mr-1" />
              Owned
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-bold mb-2 text-white drop-shadow-lg">
          {avatar.name}
        </h3>
        {/* <p className="text-xs text-slate-100 mb-3 font-semibold bg-slate-700/80 rounded-lg px-3 py-1.5 backdrop-blur-sm border border-slate-500/60">{avatar.theme}</p> */}

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex justify-between items-center text-xs p-2 bg-slate-700/80 rounded-lg border border-slate-500/60 backdrop-blur-sm">
            <span className="text-slate-100 font-semibold">Daily Lessons:</span>
            <span className="font-bold text-emerald-300 text-sm">{avatar.lessons}</span>
          </div>
          {!owned && (
            <div className="flex justify-between items-center text-xs p-2 bg-gradient-to-r from-green-500/60 to-emerald-500/60 rounded-lg border border-green-400/80 backdrop-blur-sm">
              <span className="text-white font-semibold">Price:</span>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3 text-green-100" />
                <span className="font-bold text-green-100 text-sm">
                  {avatar.price === 0 ? "Free" : `${avatar.price.toLocaleString()} USDC`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-2 pt-2">
          {equipped && (
            <Button
              disabled
              className="w-full h-10 bg-gradient-to-r from-emerald-500/90 to-green-500/90 text-white border-2 border-emerald-400/90 cursor-not-allowed rounded-lg font-bold text-sm shadow-lg backdrop-blur-sm"
            >
              <Check className="w-4 h-4 mr-2" />
              Currently Equipped
            </Button>
          )}

          {owned && !equipped && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEquip(avatar.id);
              }}
              className="w-full h-10 bg-gradient-to-r from-blue-500/90 to-cyan-500/90 hover:from-blue-400/90 hover:to-cyan-400/90 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 border-2 border-blue-400/60 text-sm backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Equip Avatar
            </Button>
          )}

          {!owned && userUSDC >= avatar.price && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPurchase(avatar.id);
              }}
              className="w-full h-10 bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-400/90 hover:to-pink-400/90 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 border-2 border-purple-400/60 text-sm backdrop-blur-sm"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {avatar.price === 0 ? "Claim Free" : "Purchase"}
            </Button>
          )}

          {!owned && userUSDC < avatar.price && (
            <Button
              disabled
              className="w-full h-10 bg-gradient-to-r from-red-600/90 to-red-500/90 text-white border-2 border-red-400/80 cursor-not-allowed rounded-lg font-bold text-sm shadow-lg backdrop-blur-sm"
            >
              <Lock className="w-4 h-4 mr-2" />
              Insufficient USDC
            </Button>
          )}
        </div>

        {/* Details Section */}
        {selectedAvatar === avatar.id && (
          <div className="mt-4 p-3 bg-slate-700/90 rounded-lg border border-slate-500/60 backdrop-blur-sm text-xs text-white animate-fade-in">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="font-bold text-purple-300 text-xs">Avatar Benefits</span>
            </div>
            <ul className="space-y-1">
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                <span className="text-xs text-slate-100">{avatar.lessons} daily lessons allowed</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                <span className="text-xs text-slate-100">Unique character appearance</span>
              </li>
              {/* <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                <span className="text-xs text-slate-100">{avatar.theme}</span>
              </li> */}
              {avatar.lessons >= 10 && (
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  <span className="text-xs text-slate-100">Bonus XP for streaks</span>
                </li>
              )}
              {avatar.lessons >= 25 && (
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                  <span className="text-xs text-slate-100">Premium lesson content</span>
                </li>
              )}
              {avatar.lessons >= 50 && (
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                  <span className="text-xs text-slate-100">Early access to new features</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AvatarCard;
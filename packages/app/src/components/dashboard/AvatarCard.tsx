
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/config";
import { Avatar } from "@/app/hooks/useAvatarHooks";

interface AvatarCardProps {
  avatar: Avatar;
}

const AvatarCard = ({ avatar }: AvatarCardProps) => {
  const navigate = useRouter();

  if (!avatar) return;

  return (
    <Card className="p-6 bg-slate-900/70 border border-slate-700/50 backdrop-blur-xl">
      <div className="text-center mb-4">
        <div className="w-24 h-24 text-6xl mx-auto mb-3 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-lg flex items-center justify-center">
          <img src={API_URL + avatar?.imageUrl} className="w-20 h-20 rounded-lg" />
        </div>
        <h3 className="text-xl font-bold text-white">{avatar.name}</h3>
        {/* <p className="text-sm text-slate-300">{avatar.theme}</p> */}
        <Badge className="mt-2 bg-purple-500/20 text-purple-300 border-purple-400/30">
          {avatar.lessons} lessons/day
        </Badge>
      </div>
      <Button
        onClick={() => navigate.push("/marketplace")}
        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 rounded-xl transition-all duration-300 hover:scale-105"
      >
        <ShoppingBag className="w-4 h-4 mr-2" />
        Visit Marketplace
      </Button>
    </Card>
  );
};

export default AvatarCard;

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AvatarCard from "./AvatarCard";
import { Avatar } from "@/app/hooks/useAvatarHooks";

interface AvatarTabsProps {
  avatars: Avatar[];
  ownedAvatars: Avatar[];
  availableAvatars: Avatar[];
  equippedAvatarId: string | null; // ID of currently equipped avatar
  userUSDC: number;
  selectedAvatar: string | null;
  hoveredAvatar: string | null;
  onPurchase: (avatarId: string) => void;
  onEquip: (avatarId: string) => void;
  onSelect: (avatarId: string | null) => void;
  onHover: (avatarId: string | null) => void;
}

const AvatarTabs = ({
  avatars,
  ownedAvatars,
  availableAvatars,
  equippedAvatarId,
  userUSDC,
  selectedAvatar,
  hoveredAvatar,
  onPurchase,
  onEquip,
  onSelect,
  onHover
}: AvatarTabsProps) => {

  // Helper function to check if avatar is owned
  const isAvatarOwned = (avatarId: string): boolean => {
    return ownedAvatars.some(owned => owned.id === avatarId);
  };

  // Helper function to check if avatar is equipped
  const isAvatarEquipped = (avatarId: string): boolean => {
    return equippedAvatarId === avatarId;
  };

  return (
    <Tabs defaultValue="all" className="space-y-6">
      <div className="flex justify-center">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-xl p-1">
          <TabsTrigger value="all" className="rounded-lg text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/60 data-[state=active]:to-pink-500/60 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
            All Avatars
          </TabsTrigger>
          <TabsTrigger value="owned" className="rounded-lg text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/60 data-[state=active]:to-cyan-500/60 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
            My Collection
          </TabsTrigger>
          <TabsTrigger value="available" className="rounded-lg text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/60 data-[state=active]:to-orange-500/60 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
            Shop
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all" className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {avatars.map((avatar) => (
            <AvatarCard
              key={avatar.id}
              avatar={avatar}
              userUSDC={userUSDC}
              selectedAvatar={selectedAvatar}
              hoveredAvatar={hoveredAvatar}
              equipped={isAvatarEquipped(avatar.id)}
              owned={isAvatarOwned(avatar.id)}
              onPurchase={onPurchase}
              onEquip={onEquip}
              onSelect={onSelect}
              onHover={onHover}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="owned">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ownedAvatars.map((avatar) => (
            <AvatarCard
              key={avatar.id}
              avatar={avatar}
              userUSDC={userUSDC}
              selectedAvatar={selectedAvatar}
              hoveredAvatar={hoveredAvatar}
              equipped={isAvatarEquipped(avatar.id)}
              owned={true} // All avatars in this tab are owned
              onPurchase={onPurchase}
              onEquip={onEquip}
              onSelect={onSelect}
              onHover={onHover}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="available">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableAvatars.map((avatar) => (
            <AvatarCard
              key={avatar.id}
              avatar={avatar}
              userUSDC={userUSDC}
              selectedAvatar={selectedAvatar}
              hoveredAvatar={hoveredAvatar}
              equipped={false} // Available avatars are never equipped
              owned={false} // Available avatars are never owned
              onPurchase={onPurchase}
              onEquip={onEquip}
              onSelect={onSelect}
              onHover={onHover}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AvatarTabs;
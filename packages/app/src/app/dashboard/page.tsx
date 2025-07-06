"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, Star } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AvatarCard from "@/components/dashboard/AvatarCard";
import StatsCard from "@/components/dashboard/StatsCard";
import BadgesTab from "@/components/dashboard/BadgesTab";
import ProgressTab from "@/components/dashboard/ProgressTab";
import RewardsTab from "@/components/dashboard/RewardsTab";
import { useGetUserById } from "../hooks/useUserHooks";
import { Certificate } from "../hooks/useCertificateHooks";
import { Badge } from "../hooks/useBadgeHooks";

const Dashboard = () => {
    const user = useGetUserById();

    const userStats = {
        coins: 450,
        level: 12,
        xp: 2840,
        nextLevelXp: 3000,
        dailyLessons: { used: 2, total: 5 },
        streak: 7
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-6 py-8 relative z-10">
                <DashboardHeader />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Avatar & Stats */}
                    <div className="space-y-6">
                        {user?.data?.equippedAvatar?.avatar &&
                            <AvatarCard avatar={user?.data?.equippedAvatar?.avatar} />}

                        <StatsCard
                            icon={Coins}
                            iconColor="text-yellow-400"
                            title="LingoCoins"
                            value={userStats.coins.toLocaleString()}
                            buttonText="Convert to USDC"
                            buttonColor="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-400/25"
                            onButtonClick={() => console.log("Convert to USDC")}
                        />

                        {/* <StatsCard
                            icon={Star}
                            iconColor="text-cyan-400"
                            title={`Level ${userStats.level}`}
                            value={`${userStats.xp} XP`}
                            subtitle={`${userStats.nextLevelXp - userStats.xp} to next`}
                            progress={{
                                current: userStats.xp % 1000,
                                max: 1000,
                                color: "bg-gradient-to-r from-cyan-400 to-blue-500"
                            }}
                        /> */}
                    </div>

                    {/* Middle & Right Columns - Tabs */}
                    <div className="lg:col-span-2">
                        {user.data && <BadgesTab certificates={user.data?.certificates as Certificate[] || []} badges={user.data.badges as Badge[] || []} />}
                        {/* <Tabs defaultValue="badges" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-3 bg-slate-900/70 border border-slate-700/50 rounded-xl">
                                <TabsTrigger value="badges" className="text-white data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Badges</TabsTrigger>
                                <TabsTrigger value="progress" className="text-white data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Progress</TabsTrigger>
                                <TabsTrigger value="rewards" className="text-white data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Rewards</TabsTrigger>
                            </TabsList>
                            {user.data &&
                                <TabsContent value="badges">
                                    <BadgesTab certificates={user.data?.certificates as Certificate[] || []} badges={user.data.badges as Badge[] || []} />
                                </TabsContent>}

                            <TabsContent value="progress">
                                <ProgressTab userStats={userStats} />
                            </TabsContent>

                            <TabsContent value="rewards">
                                <RewardsTab userStats={userStats} />
                            </TabsContent>

                        </Tabs> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

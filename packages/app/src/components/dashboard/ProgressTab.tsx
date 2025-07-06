
import { Card } from "@/components/ui/card";

interface UserStats {
  dailyLessons: { used: number; total: number };
  streak: number;
}

interface ProgressTabProps {
  userStats: UserStats;
}

const ProgressTab = ({ userStats }: ProgressTabProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white">Learning Progress</h3>
      
      <div className="grid gap-4">
        <Card className="p-6 bg-slate-900/70 border border-slate-700/50 backdrop-blur-xl rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-white">Daily Lessons</h4>
            <span className="text-sm text-slate-300">
              {userStats.dailyLessons.used}/{userStats.dailyLessons.total}
            </span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
              style={{width: `${(userStats.dailyLessons.used / userStats.dailyLessons.total) * 100}%`}}
            ></div>
          </div>
          <p className="text-xs text-slate-300">
            Complete {userStats.dailyLessons.total - userStats.dailyLessons.used} more lessons today
          </p>
        </Card>

        <Card className="p-6 bg-slate-900/70 border border-slate-700/50 backdrop-blur-xl rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🔥</div>
            <div>
              <h4 className="font-bold text-white">{userStats.streak} Day Streak</h4>
              <p className="text-sm text-slate-300">Keep it up! Streaks earn bonus rewards</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgressTab;

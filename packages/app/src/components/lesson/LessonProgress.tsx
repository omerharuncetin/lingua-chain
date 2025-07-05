
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

interface LessonProgressProps {
  progress: number;
}

const LessonProgress = ({ progress }: LessonProgressProps) => {
  return (
    <div className="relative mb-12">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
      
      <div className="relative p-8 bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-white font-semibold text-lg">Progress</span>
          </div>
          <span className="text-cyan-400 font-bold text-xl">{Math.round(progress)}%</span>
        </div>
        
        <div className="relative">
          <Progress 
            value={progress} 
            className="h-4 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/30"
          />
          {/* Enhanced progress bar with glow */}
          <div 
            className="absolute top-0 left-0 h-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full shadow-lg shadow-cyan-500/30 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/50 to-purple-300/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonProgress;


import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface CertificateSectionProps {
  selectedLevel: string;
}

const CertificateSection = ({ selectedLevel }: CertificateSectionProps) => {
  const getLevelProgress = (level: string) => {
    const progressMap = {
      A1: { completed: 3, total: 8, percentage: 37.5 },
      A2: { completed: 2, total: 8, percentage: 25 },
      B1: { completed: 3, total: 8, percentage: 37.5 },
      B2: { completed: 2, total: 8, percentage: 25 },
      C1: { completed: 2, total: 8, percentage: 25 },
      C2: { completed: 2, total: 8, percentage: 25 }
    };
    return progressMap[level as keyof typeof progressMap] || { completed: 0, total: 8, percentage: 0 };
  };

  const progress = getLevelProgress(selectedLevel);

  return (
    <div className="mt-20 flex justify-center">
      <Card className="w-80 p-6 bg-white/5 border-2 border-yellow-500/40 hover:border-yellow-400/60 backdrop-blur-sm text-center rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20 group">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3 group-hover:animate-bounce" />
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {selectedLevel} Level Certificate
            </h3>
            <p className="text-slate-300 mb-4 text-sm">Complete all lessons to unlock your NFT certificate</p>
            <div className="w-full bg-slate-700/50 rounded-full h-2 mb-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-1000 shadow-lg shadow-yellow-500/30" 
                style={{width: `${progress.percentage}%`}}
              ></div>
            </div>
            <p className="text-slate-400 text-xs">{progress.completed} of {progress.total} lessons completed</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CertificateSection;

import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface CertificateSectionProps {
  selectedLevel: string;
  completedLessons: number;
  totalLessons: number;
}

const CertificateSection = ({ selectedLevel, completedLessons, totalLessons }: CertificateSectionProps) => {
  // Calculate percentage based on actual data
  const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Determine if certificate is unlocked
  const isUnlocked = completedLessons === totalLessons && totalLessons > 0;

  // Get level-specific certificate details
  const getCertificateDetails = (level: string) => {
    const details = {
      A1: { name: "Beginner Certificate", color: "from-emerald-400 to-green-400" },
      A2: { name: "Elementary Certificate", color: "from-cyan-400 to-blue-400" },
      B1: { name: "Intermediate Certificate", color: "from-blue-400 to-indigo-400" },
      B2: { name: "Upper-Intermediate Certificate", color: "from-indigo-400 to-purple-400" },
      C1: { name: "Advanced Certificate", color: "from-purple-400 to-pink-400" },
      C2: { name: "Mastery Certificate", color: "from-yellow-400 to-orange-400" }
    };
    return details[level as keyof typeof details] || {
      name: `${level} Certificate`,
      color: "from-yellow-400 to-orange-400"
    };
  };

  const certificateDetails = getCertificateDetails(selectedLevel);

  return (
    <div className="mt-20 flex justify-center">
      <Card className={`w-80 p-6 bg-white/5 border-2 ${isUnlocked
          ? 'border-yellow-500/60 shadow-xl shadow-yellow-500/30'
          : 'border-yellow-500/40'
        } hover:border-yellow-400/60 backdrop-blur-sm text-center rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20 group`}>
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${isUnlocked
              ? 'from-yellow-500/20 to-orange-500/20'
              : 'from-yellow-500/10 to-orange-500/10'
            } rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
          <div className="relative">
            <Trophy className={`w-12 h-12 ${isUnlocked
                ? 'text-yellow-400 animate-pulse'
                : 'text-yellow-400/70'
              } mx-auto mb-3 group-hover:animate-bounce`} />
            <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r ${certificateDetails.color} bg-clip-text text-transparent`}>
              {certificateDetails.name}
            </h3>
            <p className="text-slate-300 mb-4 text-sm">
              {isUnlocked
                ? "🎉 Congratulations! Certificate unlocked!"
                : "Complete all lessons to unlock your NFT certificate"}
            </p>
            <div className="w-full bg-slate-700/50 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${certificateDetails.color} h-2 rounded-full transition-all duration-1000 shadow-lg ${isUnlocked ? 'shadow-yellow-500/50' : 'shadow-yellow-500/30'
                  }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-slate-400 text-xs">
              {completedLessons} of {totalLessons} lessons completed
              {percentage > 0 && ` (${Math.round(percentage)}%)`}
            </p>

            {isUnlocked && (
              <button className="mt-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105">
                Claim Certificate
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CertificateSection;
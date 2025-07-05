
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const LearningPathHeader = () => {
  const navigate = useRouter();

  const handleProfileClick = () => {
    navigate.push("/dashboard");
  };

  return (
    <div className="flex justify-between items-center mb-16">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
          {/* <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Learning Path
          </h1> */}
        </div>
        {/* <p className="text-slate-400 text-lg">Master English with cutting-edge learning technology</p> */}
      </div>
      <Button
        onClick={handleProfileClick}
        className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-8 py-4 rounded-2xl border-0 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
      >
        <Trophy className="w-5 h-5 mr-3 group-hover:animate-bounce" />
        <span className="font-semibold">Profile</span>
      </Button>
    </div>
  );
};

export default LearningPathHeader;


import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardHeader = () => {
  const navigate = useRouter();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        Dashboard
      </h1>
      <div className="flex space-x-3">
        {/* <Button
          onClick={() => navigate.push("/leaderboard")}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-semibold px-6 py-3 h-auto transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25 rounded-xl"
        >
          <Users className="w-5 h-5 mr-2" />
          Leaderboard
        </Button> */}
        <Button
          onClick={() => navigate.push("/learning-path")}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 h-auto transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25 rounded-xl"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Continue Learning
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;

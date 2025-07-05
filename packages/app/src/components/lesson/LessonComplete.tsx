
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LessonCompleteProps {
  score: number;
  totalExercises: number;
  onContinueLearning: () => void;
  onBackToDashboard: () => void;
}

const LessonComplete = ({
  score,
  totalExercises,
  onContinueLearning,
  onBackToDashboard
}: LessonCompleteProps) => {
  const percentage = Math.round((score / totalExercises) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0E10] via-[#1a1a1c] to-[#0E0E10] text-white flex items-center justify-center">
      <Card className="p-12 bg-gradient-to-br from-[#00FFA3]/10 to-[#FFD700]/10 border-[#00FFA3]/20 backdrop-blur-sm max-w-lg mx-auto text-center">
        <div className="animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-[#00FFA3] to-[#00D4AA] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Lesson Complete!</h2>
          
          <div className="mb-6">
            <p className="text-gray-300 mb-2">Your score:</p>
            <p className="text-2xl font-bold text-[#00FFA3] mb-2">{score}/{totalExercises}</p>
            <p className="text-sm text-gray-400">{percentage}% correct</p>
          </div>

          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 font-medium">+{score * 50} LingoCoins Earned!</p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onContinueLearning} 
              className="w-full bg-gradient-to-r from-[#00FFA3] to-[#00D4AA] hover:from-[#00D4AA] to-[#00FFA3] text-black font-bold"
            >
              Continue Learning
            </Button>
            <Button 
              onClick={onBackToDashboard} 
              variant="outline" 
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/30"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LessonComplete;

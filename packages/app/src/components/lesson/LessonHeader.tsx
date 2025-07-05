
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, Brain } from "lucide-react";

interface LessonHeaderProps {
  title: string;
  currentExercise: number;
  totalExercises: number;
  hasAudio: boolean;
  onBack: () => void;
  onPlayAudio: () => void;
}

const LessonHeader = ({
  title,
  currentExercise,
  totalExercises,
  hasAudio,
  onBack,
  onPlayAudio
}: LessonHeaderProps) => {
  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance("Listen carefully to this exercise");
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
    onPlayAudio();
  };

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-96 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative flex items-center justify-between mb-12 p-6 bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-slate-700/50">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-3 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-2xl transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-slate-400 text-lg">
                Exercise {currentExercise + 1} of {totalExercises}
              </p>
            </div>
          </div>
        </div>
        
        {hasAudio && (
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayAudio}
            className="p-4 rounded-2xl border-2 border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
          >
            <Volume2 className="w-6 h-6 group-hover:animate-pulse" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default LessonHeader;

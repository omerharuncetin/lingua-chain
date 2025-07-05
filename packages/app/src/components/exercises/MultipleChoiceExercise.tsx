
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Volume2, Sparkles } from "lucide-react";

interface Exercise {
  id: number;
  type: "multiple_choice";
  question: string;
  answers: string[];
  correct: number;
  hasAudio?: boolean;
}

interface MultipleChoiceExerciseProps {
  exercise: Exercise;
  onComplete: (isCorrect: boolean) => void;
}

const MultipleChoiceExercise = ({
  exercise,
  onComplete
}: MultipleChoiceExerciseProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const playAudio = () => {
    console.log("Playing audio for:", exercise.question);
  };

  const handleAnswerSelect = (index: number) => {
    if (!showFeedback) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowFeedback(true);
      const isCorrect = selectedAnswer === exercise.correct;
      onComplete(isCorrect);
    }
  };

  return (
    <div className="relative">
      {/* Background glow effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <Card className="relative p-10 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl max-w-3xl mx-auto rounded-3xl overflow-hidden">
        {/* Card inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="p-2 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">{exercise.question}</h2>
              {exercise.hasAudio && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={playAudio}
                  className="rounded-2xl border-2 border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400/50 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-6 mb-10">
            {exercise.answers.map((answer, index) => {
              let buttonClass = "w-full p-8 text-xl font-semibold rounded-3xl border-2 transition-all duration-500 relative overflow-hidden group ";
              
              if (showFeedback) {
                if (index === exercise.correct) {
                  buttonClass += "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-400/60 text-emerald-300 shadow-lg shadow-emerald-500/25";
                } else if (index === selectedAnswer && selectedAnswer !== exercise.correct) {
                  buttonClass += "bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-400/60 text-red-300 animate-shake shadow-lg shadow-red-500/25";
                } else {
                  buttonClass += "bg-slate-800/30 border-slate-600/30 text-slate-500";
                }
              } else {
                if (selectedAnswer === index) {
                  buttonClass += "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/60 text-blue-300 scale-105 shadow-lg shadow-blue-500/25";
                } else {
                  buttonClass += "bg-slate-800/40 border-slate-600/40 text-slate-300 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300 hover:scale-102 hover:shadow-lg hover:shadow-blue-500/20";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={buttonClass}
                  disabled={showFeedback}
                >
                  {/* Button glow effect */}
                  {selectedAnswer === index && !showFeedback && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50"></div>
                  )}
                  {showFeedback && index === exercise.correct && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl opacity-50"></div>
                  )}
                  
                  <div className="relative flex items-center justify-between">
                    <span className="text-left">{answer}</span>
                    {showFeedback && index === exercise.correct && (
                      <CheckCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
                    )}
                    {showFeedback && index === selectedAnswer && selectedAnswer !== exercise.correct && (
                      <XCircle className="w-8 h-8 text-red-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <Button 
              onClick={handleSubmit}
              disabled={selectedAnswer === null || showFeedback}
              className="px-16 py-6 text-xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white rounded-3xl border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 group"
            >
              <span className="group-hover:scale-110 transition-transform inline-block">
                {showFeedback ? "Continue" : "Check Answer"}
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Success overlay */}
      {showFeedback && selectedAnswer === exercise.correct && (
        <div className="fixed inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-3xl animate-pulse"></div>
              <CheckCircle className="relative w-32 h-32 text-emerald-400 mx-auto mb-6 animate-bounce" />
            </div>
            <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Perfect!
            </h2>
            <p className="text-2xl text-emerald-200">Great job, keep it up!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceExercise;

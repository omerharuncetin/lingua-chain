
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";
import ExamTimer from "./ExamTimer";

interface Question {
  id: number;
  question: string;
  answers: string[];
  correct: number;
}

interface CertificateExamProps {
  activeLevel: string;
  currentQuestion: number;
  selectedAnswer: number | null;
  showFeedback: boolean;
  timeLeft: number;
  currentQ: Question;
  totalQuestions: number;
  onAnswerSelect: (answerIndex: number) => void;
  onSubmit: () => void;
}

const CertificateExam = ({
  activeLevel,
  currentQuestion,
  selectedAnswer,
  showFeedback,
  timeLeft,
  currentQ,
  totalQuestions,
  onAnswerSelect,
  onSubmit
}: CertificateExamProps) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header with Timer */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{activeLevel} Certificate Exam</h1>
            <p className="text-slate-300 mb-4">Pass with 70% or higher to earn your certificate</p>
            
            {/* Countdown Timer */}
            <ExamTimer timeLeft={timeLeft} />
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Question Card */}
          <Card className="p-8 bg-slate-900/70 border border-slate-700/50 backdrop-blur-xl mb-8 shadow-2xl shadow-cyan-500/25 rounded-2xl">
            <h2 className="text-xl font-semibold mb-6 text-white">{currentQ.question}</h2>
            
            <div className="space-y-3">
              {currentQ.answers.map((answer, index) => {
                let buttonClass = "w-full p-4 text-left rounded-xl border transition-all duration-300 ";
                
                if (showFeedback) {
                  if (index === currentQ.correct) {
                    buttonClass += "bg-emerald-500/20 border-emerald-400/50 text-emerald-100";
                  } else if (index === selectedAnswer && selectedAnswer !== currentQ.correct) {
                    buttonClass += "bg-red-500/20 border-red-400/50 text-red-100 animate-shake";
                  } else {
                    buttonClass += "bg-slate-800/50 border-slate-600/30 text-slate-300";
                  }
                } else {
                  if (selectedAnswer === index) {
                    buttonClass += "bg-cyan-500/20 border-cyan-400/50 text-white";
                  } else {
                    buttonClass += "bg-slate-800/50 border-slate-600/30 text-slate-300 hover:border-cyan-400/50 hover:bg-cyan-500/10";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => onAnswerSelect(index)}
                    className={buttonClass}
                  >
                    <div className="flex items-center space-x-3">
                      {showFeedback && index === currentQ.correct && (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      )}
                      {showFeedback && index === selectedAnswer && selectedAnswer !== currentQ.correct && (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-white">{answer}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button 
              onClick={onSubmit} 
              disabled={selectedAnswer === null || showFeedback} 
              className="px-12 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold disabled:opacity-50 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
            >
              {showFeedback ? "Loading..." : "Submit Answer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateExam;

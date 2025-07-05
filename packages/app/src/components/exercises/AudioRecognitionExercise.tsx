
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Volume2 } from "lucide-react";

interface Exercise {
  id: number;
  type: "audio_recognition";
  audioText: string;
  question: string;
  answers: string[];
  correct: number;
  hasAudio: boolean;
}

interface AudioRecognitionExerciseProps {
  exercise: Exercise;
  onComplete: (isCorrect: boolean) => void;
}

const AudioRecognitionExercise = ({
  exercise,
  onComplete
}: AudioRecognitionExerciseProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(exercise.audioText);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
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
    <>
      <Card className="p-8 bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-600 mb-6">{exercise.question}</h2>
          
          <div className="mb-8">
            <Button
              onClick={playAudio}
              variant="outline"
              size="lg"
              className="w-32 h-32 rounded-full border-4 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Volume2 className="w-8 h-8" />
            </Button>
            <p className="text-sm text-gray-600 mt-3">Tap to play audio</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {exercise.answers.map((answer, index) => {
            let buttonClass = "w-full p-6 text-lg font-semibold rounded-2xl border-2 transition-all duration-300 ";
            
            if (showFeedback) {
              if (index === exercise.correct) {
                buttonClass += "bg-green-100 border-green-500 text-green-800";
              } else if (index === selectedAnswer && selectedAnswer !== exercise.correct) {
                buttonClass += "bg-red-100 border-red-500 text-red-800";
              } else {
                buttonClass += "bg-gray-100 border-gray-300 text-gray-500";
              }
            } else {
              if (selectedAnswer === index) {
                buttonClass += "bg-blue-100 border-blue-500 text-blue-800 scale-105";
              } else {
                buttonClass += "bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={buttonClass}
                disabled={showFeedback}
              >
                <div className="flex items-center justify-between">
                  <span>{answer}</span>
                  {showFeedback && index === exercise.correct && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                  {showFeedback && index === selectedAnswer && selectedAnswer !== exercise.correct && (
                    <XCircle className="w-6 h-6 text-red-600" />
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
            className="px-12 py-4 text-lg font-bold bg-green-500 hover:bg-green-600 text-white rounded-2xl disabled:opacity-50"
          >
            {showFeedback ? "Continue" : "Check"}
          </Button>
        </div>
      </Card>

      {showFeedback && selectedAnswer === exercise.correct && (
        <div className="fixed inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center">
            <CheckCircle className="w-32 h-32 text-white mx-auto mb-4 animate-scale-in" />
            <h2 className="text-4xl font-bold text-white mb-2">Correct!</h2>
            <p className="text-xl text-green-100">Great job!</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AudioRecognitionExercise;

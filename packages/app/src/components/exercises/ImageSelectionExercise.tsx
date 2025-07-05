
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface Exercise {
  id: number;
  type: "image_selection";
  question: string;
  options: Array<{
    id: number;
    image: string;
    text: string;
  }>;
  correct: number;
  hasAudio?: boolean;
}

interface ImageSelectionExerciseProps {
  exercise: Exercise;
  onComplete: (isCorrect: boolean) => void;
}

const ImageSelectionExercise = ({
  exercise,
  onComplete
}: ImageSelectionExerciseProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

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
      <Card className="p-8 bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{exercise.question}</h2>
          <p className="text-gray-600">Tap the correct image</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {exercise.options.map((option, index) => {
            let cardClass = "cursor-pointer transition-all duration-300 border-4 rounded-2xl overflow-hidden ";
            
            if (showFeedback) {
              if (index === exercise.correct) {
                cardClass += "border-green-500 bg-green-50 scale-105 shadow-lg shadow-green-200";
              } else if (index === selectedAnswer && selectedAnswer !== exercise.correct) {
                cardClass += "border-red-500 bg-red-50 animate-shake";
              } else {
                cardClass += "border-gray-300 opacity-60";
              }
            } else {
              if (selectedAnswer === index) {
                cardClass += "border-blue-500 bg-blue-50 scale-105 shadow-lg shadow-blue-200";
              } else {
                cardClass += "border-gray-300 hover:border-blue-300 hover:scale-102";
              }
            }

            return (
              <div
                key={option.id}
                onClick={() => handleAnswerSelect(index)}
                className={cardClass}
              >
                <div className="relative">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <div className="text-6xl">🖼️</div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-lg font-semibold text-center text-gray-800">
                      {option.text}
                    </p>
                  </div>
                  {showFeedback && index === exercise.correct && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {showFeedback && index === selectedAnswer && selectedAnswer !== exercise.correct && (
                    <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              </div>
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

export default ImageSelectionExercise;

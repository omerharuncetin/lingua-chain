
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface Exercise {
  id: number;
  type: "fill_blank";
  sentence: string;
  correctAnswer: string;
  hasAudio?: boolean;
}

interface FillBlankExerciseProps {
  exercise: Exercise;
  onComplete: (isCorrect: boolean) => void;
}

const FillBlankExercise = ({
  exercise,
  onComplete
}: FillBlankExerciseProps) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const isCorrect = userAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase();
  const parts = exercise.sentence.split("___");

  // Generate letters for selection
  const generateLetters = () => {
    const correctLetters = exercise.correctAnswer.toLowerCase().split('');
    const randomLetters = ['a', 'e', 'i', 'o', 'u', 'r', 's', 't', 'n', 'l', 'd', 'c', 'h', 'f', 'p', 'g', 'b', 'y', 'w', 'k', 'v', 'j', 'x', 'q', 'z'];

    // Add some random letters (3-5 extra letters)
    const extraCount = Math.floor(Math.random() * 3) + 3;
    const extraLetters: string[] = [];
    for (let i = 0; i < extraCount; i++) {
      const randomLetter = randomLetters[Math.floor(Math.random() * randomLetters.length)];
      if (!correctLetters.includes(randomLetter) && !extraLetters.includes(randomLetter)) {
        extraLetters.push(randomLetter);
      }
    }

    // Combine and shuffle
    const allLetters = [...correctLetters, ...extraLetters];
    return allLetters.sort(() => Math.random() - 0.5);
  };

  const [availableLetters] = useState(generateLetters());

  const handleLetterClick = (letter: string) => {
    if (showFeedback) return;
    setUserAnswer(prev => prev + letter);
  };

  const handleClearAnswer = () => {
    if (showFeedback) return;
    setUserAnswer("");
  };

  const handleSubmit = () => {
    setShowFeedback(true);
    onComplete(isCorrect);
  };

  return (
    <>
      <Card className="p-8 bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-600 mb-6">Fill in the blank</h2>
          <div className="text-3xl font-semibold text-gray-800 flex items-center justify-center gap-2 mb-8">
            <span>{parts[0]}</span>
            <div className="relative">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className={`text-center text-3xl font-semibold w-48 h-16 border-2 border-dashed ${showFeedback
                  ? isCorrect
                    ? "border-green-500 bg-green-50 text-green-800"
                    : "border-red-500 bg-red-50 text-red-800"
                  : "border-blue-400 focus:border-blue-600"
                  }`}
                placeholder="..."
                disabled={showFeedback}
              />
              {showFeedback && (
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              )}
            </div>
            <span>{parts[1]}</span>
          </div>
        </div>

        {/* Letter Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Select letters:</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAnswer}
              disabled={showFeedback || !userAnswer}
              className="text-gray-600 hover:text-gray-800"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {availableLetters.map((letter, index) => (
              <button
                key={`${letter}-${index}`}
                onClick={() => handleLetterClick(letter)}
                disabled={showFeedback}
                className={`
                  w-12 h-12 text-xl font-bold rounded-lg border-2 transition-all duration-200
                  ${showFeedback
                    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-white border-blue-300 text-blue-700 hover:border-blue-500 hover:bg-blue-50 hover:scale-105 active:scale-95"
                  }
                `}
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {showFeedback && !isCorrect && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 font-semibold">Correct answer: {exercise.correctAnswer}</p>
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={!userAnswer.trim() || showFeedback}
            className="px-12 py-4 text-lg font-bold bg-green-500 hover:bg-green-600 text-white rounded-2xl disabled:opacity-50"
          >
            {showFeedback ? "Continue" : "Check"}
          </Button>
        </div>
      </Card>

      {/* Celebration Overlay */}
      {showFeedback && isCorrect && (
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

export default FillBlankExercise;

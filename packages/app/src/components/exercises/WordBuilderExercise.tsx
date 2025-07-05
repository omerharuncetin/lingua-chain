
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface Exercise {
  id: number;
  type: "word_builder";
  prompt: string;
  words: string[];
  correctOrder: number[];
  hasAudio?: boolean;
}

interface WordBuilderExerciseProps {
  exercise: Exercise;
  onComplete: (isCorrect: boolean) => void;
}

const WordBuilderExercise = ({
  exercise,
  onComplete
}: WordBuilderExerciseProps) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState(exercise.words);
  const [showFeedback, setShowFeedback] = useState(false);

  const correctSentence = exercise.correctOrder.map(index => exercise.words[index]);
  const isCorrect = JSON.stringify(selectedWords) === JSON.stringify(correctSentence);

  const handleWordClick = (word: string, fromSelected: boolean) => {
    if (showFeedback) return;

    if (fromSelected) {
      setSelectedWords(prev => prev.filter(w => w !== word));
      setAvailableWords(prev => [...prev, word]);
    } else {
      setSelectedWords(prev => [...prev, word]);
      setAvailableWords(prev => prev.filter(w => w !== word));
    }
  };

  const handleSubmit = () => {
    setShowFeedback(true);
    onComplete(isCorrect);
  };

  return (
    <>
      <Card className="p-8 bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-600 mb-2">Word Builder</h2>
          <p className="text-2xl font-bold text-gray-800">{exercise.prompt}</p>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-600 mb-3">Your sentence:</p>
          <div className={`min-h-20 p-4 border-2 border-dashed rounded-xl flex flex-wrap gap-2 items-center ${
            showFeedback 
              ? isCorrect 
                ? "border-green-500 bg-green-50" 
                : "border-red-500 bg-red-50"
              : "border-blue-400 bg-blue-50"
          }`}>
            {selectedWords.length === 0 ? (
              <p className="text-gray-400 italic">Tap words below to build your sentence</p>
            ) : (
              selectedWords.map((word, index) => (
                <button
                  key={`selected-${index}`}
                  onClick={() => handleWordClick(word, true)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    showFeedback
                      ? "cursor-not-allowed bg-gray-200 text-gray-600"
                      : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  }`}
                  disabled={showFeedback}
                >
                  {word}
                </button>
              ))
            )}
            {showFeedback && (
              <div className="ml-auto">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-600 mb-3">Available words:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {availableWords.map((word, index) => (
              <button
                key={`available-${index}`}
                onClick={() => handleWordClick(word, false)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all border-2 border-gray-300 hover:border-gray-400"
                disabled={showFeedback}
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {showFeedback && !isCorrect && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 font-semibold">
              Correct order: {correctSentence.join(" ")}
            </p>
          </div>
        )}

        <div className="text-center">
          <Button 
            onClick={handleSubmit}
            disabled={selectedWords.length === 0 || showFeedback}
            className="px-12 py-4 text-lg font-bold bg-green-500 hover:bg-green-600 text-white rounded-2xl disabled:opacity-50"
          >
            {showFeedback ? "Continue" : "Check"}
          </Button>
        </div>
      </Card>

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

export default WordBuilderExercise;

"use client";


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";


const questions = [
    {
        id: 1,
        question: "What is the correct form of 'to be' for 'I'?",
        answers: ["am", "is", "are", "be"],
        correct: 0,
        level: "A1"
    },
    {
        id: 2,
        question: "Choose the correct sentence:",
        answers: ["She don't like pizza", "She doesn't like pizza", "She not like pizza", "She no like pizza"],
        correct: 1,
        level: "A1"
    },
    {
        id: 3,
        question: "Which article is correct? '___ apple is red.'",
        answers: ["A", "An", "The", "No article"],
        correct: 1,
        level: "A1"
    },
    {
        id: 4,
        question: "What is the past tense of 'go'?",
        answers: ["goed", "went", "gone", "going"],
        correct: 1,
        level: "A2"
    },
    {
        id: 5,
        question: "Choose the correct form: 'There ___ many people at the party.'",
        answers: ["is", "are", "was", "been"],
        correct: 1,
        level: "A2"
    },
    {
        id: 6,
        question: "Select the correct comparative: 'This book is ___ than that one.'",
        answers: ["more good", "gooder", "better", "best"],
        correct: 2,
        level: "A2"
    },
    {
        id: 7,
        question: "Which sentence uses 'going to' correctly for future plans?",
        answers: ["I go to travel next week", "I am going travel next week", "I am going to travel next week", "I will going to travel next week"],
        correct: 2,
        level: "A2"
    },
    {
        id: 8,
        question: "Which sentence uses the present perfect correctly?",
        answers: ["I have saw the movie", "I have see the movie", "I have seen the movie", "I has seen the movie"],
        correct: 2,
        level: "B1"
    },
    {
        id: 9,
        question: "Choose the correct conditional sentence:",
        answers: ["If I will have money, I buy a car", "If I had money, I would buy a car", "If I have money, I will bought a car", "If I would have money, I buy a car"],
        correct: 1,
        level: "B1"
    },
    {
        id: 10,
        question: "Select the correct indirect question:",
        answers: ["Can you tell me what time is it?", "Can you tell me what time it is?", "Can you tell me what is the time?", "Can you tell me what the time is it?"],
        correct: 1,
        level: "B1"
    },
    {
        id: 11,
        question: "Which sentence uses 'used to' correctly?",
        answers: ["I used to playing tennis", "I used to play tennis", "I use to play tennis", "I am used to play tennis"],
        correct: 1,
        level: "B1"
    },
    {
        id: 12,
        question: "Choose the correct passive voice construction:",
        answers: ["The letter was wrote by John", "The letter was written by John", "The letter has wrote by John", "The letter is wrote by John"],
        correct: 1,
        level: "B2"
    },
    {
        id: 13,
        question: "Which sentence uses the third conditional correctly?",
        answers: ["If I would have studied, I would pass the exam", "If I had studied, I would have passed the exam", "If I have studied, I would have passed the exam", "If I studied, I would have passed the exam"],
        correct: 1,
        level: "B2"
    },
    {
        id: 14,
        question: "Select the correct reported speech:",
        answers: ["He said that he will come tomorrow", "He said that he would come tomorrow", "He said that he comes tomorrow", "He said that he is coming tomorrow"],
        correct: 1,
        level: "B2"
    },
    {
        id: 15,
        question: "Which sentence uses the present perfect continuous correctly?",
        answers: ["I have been working here since five years", "I have been working here for five years", "I am working here since five years", "I have worked here since five years"],
        correct: 1,
        level: "B2"
    }
];

const PlacementTest = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const router = useRouter();


    const handleAnswerSelect = (answerIndex: number) => {
        if (showFeedback) return;
        setSelectedAnswer(answerIndex);
    };

    const handleSubmit = () => {
        if (selectedAnswer === null) return;

        setShowFeedback(true);
        if (selectedAnswer === questions[currentQuestion].correct) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
                setShowFeedback(false);
            } else {
                setIsComplete(true);
            }
        }, 1500);
    };

    const getLevel = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 80) return "B2 Upper-Intermediate";
        if (percentage >= 60) return "B1 Intermediate";
        if (percentage >= 40) return "A2 Elementary";
        return "A1 Beginner";
    };

    const handleContinue = () => {
        router.push("/learning-path");
    };

    if (isComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <Card className="p-12 bg-slate-900/70 border border-slate-700/50 backdrop-blur-xl max-w-md mx-auto text-center shadow-2xl shadow-cyan-500/25 rounded-2xl relative z-10">
                    <div className="animate-fade-in">
                        <Trophy className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4 text-white">Test Complete!</h2>
                        <div className="mb-6">
                            <p className="text-slate-300 mb-2">Your level:</p>
                            <p className="text-2xl font-bold text-cyan-400">{getLevel()}</p>
                            <p className="text-sm text-slate-400 mt-2">Score: {score}/{questions.length}</p>
                        </div>
                        <Button
                            onClick={handleContinue}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
                        >
                            Start Learning
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentQ = questions[currentQuestion];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-6 py-12 relative z-10">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-4 text-white">Placement Test</h1>
                        <p className="text-slate-300 mb-6">Let's find your English level</p>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-slate-300 mb-2">
                                <span>Question {currentQuestion + 1} of {questions.length}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-3" />
                        </div>
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
                                        onClick={() => handleAnswerSelect(index)}
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
                            onClick={handleSubmit}
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

export default PlacementTest;

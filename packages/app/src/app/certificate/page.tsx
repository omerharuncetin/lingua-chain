"use client";

import { useState, useEffect } from "react";

import CertificateRequirements from "@/components/certificate/CertificateRequirements";
import CertificateExam from "@/components/certificate/CertificateExam";
import CertificateResults from "@/components/certificate/CertificateResults";
import { examQuestions } from "@/data/examQuestions";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetUserProgressAll } from "../hooks/useUserProgressHooks";

const Certificate = () => {
    const navigate = useRouter();
    const searchParams = useSearchParams()

    const progressResponse = useGetUserProgressAll();

    const [activeLevel, setActiveLevel] = useState(searchParams.get('level') || "A1");
    const [examStarted, setExamStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
    const [timeFailed, setTimeFailed] = useState(false);
    const [canTakeExam, setCanTakeExam] = useState(false);

    const currentLevelQuestions = examQuestions[activeLevel as keyof typeof examQuestions];
    const currentQ = currentLevelQuestions[currentQuestion];

    // Countdown timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (examStarted && !isComplete && !timeFailed) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setTimeFailed(true);
                        setIsComplete(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [examStarted, isComplete, timeFailed]);

    useEffect(() => {
        if (!progressResponse.data) {
            setCanTakeExam(false);
            return;
        }

        const currentLevel = progressResponse.data.find(x => x.language.toLowerCase() === activeLevel.toLowerCase());

        if (!currentLevel) {
            setCanTakeExam(false);
            return;
        }


        if (currentLevel && currentLevel.lesson != 10) {
            setCanTakeExam(false);
            return;
        }

        setCanTakeExam(true);
    }, [activeLevel, progressResponse.data])

    const handleTabChange = (level: string) => {
        if (!examStarted) {
            setActiveLevel(level);
            // Reset all exam state when switching levels
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setShowFeedback(false);
            setScore(0);
            setIsComplete(false);
            setTimeFailed(false);
            setTimeLeft(20 * 60);
        }
    };

    const handleStartExam = () => {
        if (!canTakeExam) return;
        setExamStarted(true);
        setTimeLeft(20 * 60); // Reset to 20 minutes
    };

    const handleAnswerSelect = (answerIndex: number) => {
        if (showFeedback) return;
        setSelectedAnswer(answerIndex);
    };

    const handleSubmit = () => {
        if (selectedAnswer === null) return;

        setShowFeedback(true);
        if (selectedAnswer === currentQ.correct) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (currentQuestion < currentLevelQuestions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
                setShowFeedback(false);
            } else {
                setIsComplete(true);
            }
        }, 1500);
    };

    const handleMintCertificate = async () => {
        navigate.push('/dashboard');
    };

    if (isComplete) {
        return (
            <CertificateResults
                activeLevel={activeLevel}
                score={score}
                totalQuestions={currentLevelQuestions.length}
                timeLeft={timeLeft}
                timeFailed={timeFailed}
                onMintCertificate={handleMintCertificate}
                onNavigateToLearning={() => navigate.push("/learning-path")}
                onNavigateToDashboard={() => navigate.push("/dashboard")}
            />
        );
    }

    if (!examStarted) {
        return (
            <CertificateRequirements
                canTakeExam={canTakeExam}
                activeLevel={activeLevel}
                onTabChange={handleTabChange}
                onStartExam={handleStartExam}
                onNavigateBack={() => navigate.push("/dashboard")}
            />
        );
    }
    return (
        <CertificateExam
            activeLevel={activeLevel}
            currentQuestion={currentQuestion}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            timeLeft={timeLeft}
            currentQ={currentQ}
            totalQuestions={currentLevelQuestions.length}
            onAnswerSelect={handleAnswerSelect}
            onSubmit={handleSubmit}
        />
    );
};

export default Certificate;

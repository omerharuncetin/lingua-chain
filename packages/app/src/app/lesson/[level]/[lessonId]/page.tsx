"use client"

import { useState } from "react";
import LessonHeader from "@/components/lesson/LessonHeader";
import LessonProgress from "@/components/lesson/LessonProgress";
import LessonComplete from "@/components/lesson/LessonComplete";
import ExerciseRenderer from "@/components/lesson/ExerciseRenderer";
import { cefrLevels } from "@/data/lessonData";
import { useParams, useRouter } from "next/navigation";
import { useCreateOrUpdateUserProgress } from "@/app/hooks/useUserProgressHooks";
import { useGetUsers } from "@/app/hooks/useUserHooks";
import { useAppKitAccount } from "@reown/appkit/react";

const Lesson = () => {
    const navigate = useRouter();
    const params = useParams();

    const account = useAppKitAccount();

    const users = useGetUsers(account.address);

    const progressMutation = useCreateOrUpdateUserProgress();

    const level = params?.level as string;
    const lessonId = params?.lessonId as string;

    const [currentExercise, setCurrentExercise] = useState(0);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // Get the correct level and lesson from the data structure
    const levelData = level && cefrLevels[level as string];
    const lesson = levelData && lessonId && levelData.lessons[lessonId as string];

    if (!levelData || !lesson) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="text-center relative z-10">
                    <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
                    <p className="text-gray-400 mb-4">Level: {level}, Lesson: {lessonId}</p>
                    <button
                        onClick={() => navigate.push("/learning-path")}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl"
                    >
                        Back to Learning Path
                    </button>
                </div>
            </div>
        );
    }

    const exercises = lesson.exercises;
    const progress = ((currentExercise + 1) / exercises.length) * 100;
    const currentEx = exercises[currentExercise];

    const handleExerciseComplete = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (currentExercise < exercises.length - 1) {
                setCurrentExercise(currentExercise + 1);
            } else {
                setIsComplete(true);
            }
        }, 1500);
    };

    const playAudio = () => {
        if (currentEx.hasAudio) {
            // Audio playback logic would go here
            console.log("Playing audio for exercise:", currentEx.id);
            // In a real app, you'd play the audio file here
            // For demo purposes, we could use speech synthesis
            if ('speechSynthesis' in window && currentEx.type === 'audio_recognition') {
                const utterance = new SpeechSynthesisUtterance(currentEx.audioText);
                utterance.lang = 'en-US';
                speechSynthesis.speak(utterance);
            }
        }
    };

    const handleBack = () => navigate.push("/learning-path");
    const handleContinueLearning = async () => {
        await updateUserProgress()
        // Navigate to next lesson
        const currentLessonNum = parseInt(lessonId as string);
        if (currentLessonNum < 10) {
            navigate.push(`/lesson/${level}/${currentLessonNum + 1}`);
        } else {
            // Move to next level
            const levels = Object.keys(cefrLevels);
            const currentLevelIndex = levels.indexOf(level as string);
            if (currentLevelIndex < levels.length - 1) {
                navigate.push(`/lesson/${levels[currentLevelIndex + 1]}/1`);
            } else {
                navigate.push("/learning-path");
            }
        }
    };
    const handleBackToDashboard = async () => {
        await updateUserProgress()
        navigate.push("/dashboard");
    }

    console.log({ users: users.data });

    const updateUserProgress = async () => {
        if (users.data && users.data.length > 0) {
            const userId = users.data[0].id;
            await progressMutation.mutateAsync({
                payload: {
                    language: level,
                    lesson: parseInt(lessonId)
                },
                userId
            })

        }
    }

    if (isComplete) {
        return (
            <LessonComplete
                score={score}
                totalExercises={exercises.length}
                onContinueLearning={handleContinueLearning}
                onBackToDashboard={handleBackToDashboard}
            />
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-6 py-12 relative z-10">
                <div className="max-w-2xl mx-auto">
                    <LessonHeader
                        title={`${levelData.level} - ${lesson.title}`}
                        currentExercise={currentExercise}
                        totalExercises={exercises.length}
                        hasAudio={currentEx.hasAudio || false}
                        onBack={handleBack}
                        onPlayAudio={playAudio}
                    />

                    <LessonProgress progress={progress} />

                    <div className="mb-8">
                        <ExerciseRenderer
                            exercise={currentEx}
                            onComplete={handleExerciseComplete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lesson;

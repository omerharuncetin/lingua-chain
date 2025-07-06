"use client"

import { useState, useEffect } from "react";
import LessonHeader from "@/components/lesson/LessonHeader";
import LessonProgress from "@/components/lesson/LessonProgress";
import LessonComplete from "@/components/lesson/LessonComplete";
import ExerciseRenderer from "@/components/lesson/ExerciseRenderer";
import { cefrLevels } from "@/data/lessonData";
import { useParams, useRouter } from "next/navigation";
import { useCreateOrUpdateUserProgress } from "@/app/hooks/useUserProgressHooks";
import { useAwardBadge } from "@/app/hooks/useBadgeHooks";
import { useTodayLessonProgress } from "@/app/hooks/useDailyLessonHooks";
import { useGetUserById } from "@/app/hooks/useUserHooks";
import { CEFRLevel, getBadgeAddressByLevel } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Trophy, Lock } from "lucide-react";
import { toast } from "sonner";

const Lesson = () => {
    const navigate = useRouter();
    const params = useParams();

    const progressMutation = useCreateOrUpdateUserProgress();
    const badgeMutation = useAwardBadge();

    // Daily lesson tracking
    const {
        lessonsCompletedToday,
        incrementTodayLessons,
        isLoading: dailyLessonLoading,
        error: dailyLessonError
    } = useTodayLessonProgress();

    // Get user data to check their daily lesson limit (from equipped avatar)
    const { data: userData, isLoading: userLoading } = useGetUserById();

    const level = params?.level as string;
    const lessonId = params?.lessonId as string;

    const [currentExercise, setCurrentExercise] = useState(0);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [hasTrackedLesson, setHasTrackedLesson] = useState(false);

    // Get the correct level and lesson from the data structure
    const levelData = level && cefrLevels[level as string];
    const lesson = levelData && lessonId && levelData.lessons[lessonId as string];

    // Get user's daily lesson limit from equipped avatar
    const equippedAvatar = userData?.equippedAvatar?.avatar;
    const dailyLessonLimit = equippedAvatar?.lessons || 5; // Default to 5 if no avatar equipped
    const hasReachedLimit = lessonsCompletedToday >= dailyLessonLimit;

    // Check if user can start this lesson
    useEffect(() => {
        if (!userLoading && !dailyLessonLoading && hasReachedLimit && !hasTrackedLesson) {
            // User has reached their daily limit and this lesson hasn't been tracked yet
            // We should prevent them from starting
        }
    }, [userLoading, dailyLessonLoading, hasReachedLimit, hasTrackedLesson]);

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

    // Show daily limit reached screen
    if (!userLoading && !dailyLessonLoading && hasReachedLimit && !hasTrackedLesson) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 max-w-md mx-auto px-6">
                    <Card className="p-8 text-center bg-slate-900/80 backdrop-blur-xl border border-orange-500/30">
                        <Lock className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-4 text-white">Daily Lesson Limit Reached</h1>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-center space-x-2 text-orange-300">
                                <Clock className="w-5 h-5" />
                                <span>Today's Progress: {lessonsCompletedToday}/{dailyLessonLimit} lessons</span>
                            </div>
                            <p className="text-slate-300 text-sm">
                                You've completed all your daily lessons!
                                {equippedAvatar ? (
                                    <span> Your {equippedAvatar.name} avatar allows {dailyLessonLimit} lessons per day.</span>
                                ) : (
                                    <span> Upgrade your avatar to unlock more daily lessons!</span>
                                )}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => navigate.push("/marketplace")}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500"
                            >
                                <Trophy className="w-4 h-4 mr-2" />
                                Upgrade Avatar
                            </Button>
                            <Button
                                onClick={() => navigate.push("/learning-path")}
                                variant="outline"
                                className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                            >
                                Back to Learning Path
                            </Button>
                        </div>

                        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-400">
                                Come back tomorrow for more lessons, or upgrade your avatar for higher daily limits!
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    // Show loading screen while checking limits
    if (userLoading || dailyLessonLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-slate-400">Checking your daily lesson progress...</p>
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
            console.log("Playing audio for exercise:", currentEx.id);
            if ('speechSynthesis' in window && currentEx.type === 'audio_recognition') {
                const utterance = new SpeechSynthesisUtterance(currentEx.audioText);
                utterance.lang = 'en-US';
                speechSynthesis.speak(utterance);
            }
        }
    };

    const handleBack = () => navigate.push("/learning-path");

    const handleContinueLearning = async () => {
        const percentage = Math.round((score / exercises.length) * 100);

        if (percentage < 75) {
            navigate.push("/learning-path");
            return;
        }

        try {
            await updateUserProgress();

            // Track daily lesson completion (only once per lesson)
            if (!hasTrackedLesson) {
                await incrementTodayLessons(1);
                setHasTrackedLesson(true);
            }

            // Navigate to next lesson
            const currentLessonNum = parseInt(lessonId as string);
            if (currentLessonNum < 10) {
                navigate.push(`/lesson/${level}/${currentLessonNum + 1}`);
            } else {
                // Move to next level
                await badgeMutation.mutateAsync({
                    payload: {
                        languageLevel: level,
                        badgeAddress: getBadgeAddressByLevel(level as CEFRLevel)
                    },
                }, {
                    onSuccess: () => {
                        toast.success(`Congrats! You got a Soulbound NFT Badge for ${level}. Go to your dashboard to see it!`)
                    }
                });
                const levels = Object.keys(cefrLevels);
                const currentLevelIndex = levels.indexOf(level as string);
                if (currentLevelIndex < levels.length - 1) {
                    navigate.push(`/lesson/${levels[currentLevelIndex + 1]}/1`);
                } else {
                    navigate.push("/learning-path");
                }
            }
        } catch (error) {
            console.error('Failed to update progress or daily lessons:', error);
            // Still navigate but show an error toast in a real app
            navigate.push("/learning-path");
        }
    };

    const updateUserProgress = async () => {
        const percentage = Math.round((score / exercises.length) * 100);

        if (percentage < 75) return;

        await progressMutation.mutateAsync({
            payload: {
                language: level,
                lesson: parseInt(lessonId)
            },
        });
    };

    if (isComplete) {
        return (
            <LessonComplete
                score={score}
                totalExercises={exercises.length}
                onContinueLearning={handleContinueLearning}
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
                    {/* Daily Progress Indicator */}
                    <div className="mb-4">
                        <Card className="p-3 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-cyan-400" />
                                    <span className="text-slate-300">Today's Progress:</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-cyan-400 font-semibold">
                                        {lessonsCompletedToday}/{dailyLessonLimit}
                                    </span>
                                    {equippedAvatar && (
                                        <span className="text-xs text-slate-400">
                                            ({equippedAvatar.name})
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(lessonsCompletedToday / dailyLessonLimit) * 100}%` }}
                                ></div>
                            </div>
                        </Card>
                    </div>

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

                    {/* Warning when approaching limit */}
                    {lessonsCompletedToday >= dailyLessonLimit - 1 && !hasTrackedLesson && (
                        <Card className="p-4 bg-orange-900/20 border border-orange-500/30 mb-4">
                            <div className="flex items-center space-x-3">
                                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                <div>
                                    <h4 className="text-orange-300 font-semibold text-sm">Almost at your daily limit!</h4>
                                    <p className="text-orange-200 text-xs">
                                        You have {dailyLessonLimit - lessonsCompletedToday} lesson{dailyLessonLimit - lessonsCompletedToday !== 1 ? 's' : ''} remaining today.
                                        Consider upgrading your avatar for more daily lessons.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lesson;
"use client"

import LearningPathHeader from "@/components/learning-path/LearningPathHeader";
import LearningRoad from "@/components/learning-path/LearningRoad";

const LearningPath = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Header */}
            <div className="container mx-auto px-6 py-6 relative z-10">
                <LearningPathHeader />
                <LearningRoad />
            </div>
        </div>
    );
};

export default LearningPath;

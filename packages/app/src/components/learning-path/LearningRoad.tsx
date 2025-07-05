import { useState, useMemo } from "react";
import LessonCard from "./LessonCard";
import CertificateSection from "./CertificateSection";
import { useRouter } from "next/navigation";
import { cefrLevels } from "@/data/lessonData";
import { useGetUserProgressByLanguage } from "@/app/hooks/useUserProgressHooks";

const LearningRoad = () => {
  const navigate = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string>("A1");
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);

  const progress = useGetUserProgressByLanguage(selectedLevel);

  // Transform cefrLevels data to match the component's expected format
  const learningPaths = useMemo(() => {
    const paths: Record<string, any[]> = {};
    const currentLesson = progress.data ? progress.data.lesson : 0;

    Object.entries(cefrLevels).forEach(([level, levelData]) => {
      paths[level] = Object.entries(levelData.lessons).map(([lessonId, lessonData], index) => {
        // Determine lesson status based on index (for demo purposes)
        // You can replace this with actual user progress data
        let status = "locked";
        if (index < currentLesson) status = "completed";
        else if (index === currentLesson) status = "current";

        // Get first few exercise types as description
        const exerciseTypes = lessonData.exercises
          .slice(0, 3)
          .map(ex => {
            switch (ex.type) {
              case "multiple_choice": return "Multiple choice";
              case "fill_blank": return "Fill blanks";
              case "word_builder": return "Build sentences";
              case "audio_recognition": return "Listen & answer";
              default: return "";
            }
          })
          .filter(Boolean)
          .join(", ");

        return {
          id: parseInt(lessonId),
          title: lessonData.title,
          description: exerciseTypes || "Practice various exercises",
          status,
          coins: 10,
          exerciseCount: lessonData.exercises.length
        };
      });
    });

    return paths;
  }, [progress]);

  const handleLessonClick = (lesson: any) => {
    if (lesson.status === "locked") return;
    navigate.push(`/lesson/${selectedLevel}/${lesson.id}`);
  };

  const currentLessons = learningPaths[selectedLevel] || [];
  const levelData = cefrLevels[selectedLevel];

  // Calculate progress
  const completedLessons = progress ? progress.data?.lesson || 0 : 0;  //currentLessons.filter(l => l.status === "completed").length;
  const totalLessons = currentLessons.length;

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Level Selection */}
      <div className="mb-12 flex justify-center">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
          <div className="flex space-x-2">
            {Object.keys(cefrLevels).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${selectedLevel === level
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Level Description */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          {levelData?.level || `${selectedLevel} Level`}
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {levelData?.description || "Master English at this level"}
        </p>
        <div className="mt-4 text-sm text-slate-500">
          Progress: {completedLessons}/{totalLessons} lessons completed
        </div>
      </div>

      {/* Enhanced Road Background */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-12 rounded-full opacity-40"
        style={{ height: `${currentLessons.length * 180}px` }}
      >
        <div className="w-full h-full bg-gradient-to-b from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-full blur-sm"></div>
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-400 via-blue-400 to-purple-400 rounded-full opacity-80"></div>
      </div>

      {/* Lessons on the path */}
      <div className="relative z-10 space-y-16">
        {currentLessons.map((lesson, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div key={lesson.id} className={`flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
              {/* Lesson Card */}
              <div className={`w-96 ${isLeft ? 'mr-16' : 'ml-16'}`}>
                <LessonCard
                  lesson={lesson}
                  isHovered={hoveredLesson === lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  onMouseEnter={() => setHoveredLesson(lesson.id)}
                  onMouseLeave={() => setHoveredLesson(null)}
                />
              </div>

              {/* Enhanced connection dot on the road */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <div className={`relative w-8 h-8 rounded-full border-3 transition-all duration-500 ${lesson.status === 'completed'
                  ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/50'
                  : lesson.status === 'current'
                    ? 'bg-cyan-500 border-cyan-400 shadow-lg shadow-cyan-500/50 animate-pulse'
                    : 'bg-slate-600 border-slate-500'
                  }`}>
                  {lesson.status === 'current' && (
                    <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CertificateSection
        selectedLevel={selectedLevel}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
      />
    </div>
  );
};

export default LearningRoad;
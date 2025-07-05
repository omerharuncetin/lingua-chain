
import { useState } from "react";
import LessonCard from "./LessonCard";
import CertificateSection from "./CertificateSection";
import { useRouter } from "next/navigation";

const learningPaths = {
  A1: [
    { id: 1, title: "Basic Greetings", description: "Hello, goodbye, nice to meet you", status: "completed", coins: 50 },
    { id: 2, title: "Numbers & Time", description: "0-100, days, months, telling time", status: "completed", coins: 75 },
    { id: 3, title: "Family & Friends", description: "Describing people you know", status: "current", coins: 100 },
    { id: 4, title: "Food & Drinks", description: "Basic vocabulary for meals", status: "locked", coins: 125 },
    { id: 5, title: "Present Simple", description: "I am, you are, he/she is", status: "locked", coins: 150 },
    { id: 6, title: "Daily Activities", description: "What you do every day", status: "locked", coins: 175 },
    { id: 7, title: "Shopping", description: "Buying things, asking prices", status: "locked", coins: 200 },
    { id: 8, title: "Directions", description: "Where is...? Turn left/right", status: "locked", coins: 250 }
  ],
  A2: [
    { id: 9, title: "Past Simple", description: "Yesterday, last week, was/were", status: "completed", coins: 300 },
    { id: 10, title: "Future Plans", description: "Going to, will, next week", status: "completed", coins: 350 },
    { id: 11, title: "Travel & Transport", description: "Airport, train, booking tickets", status: "current", coins: 400 },
    { id: 12, title: "Health & Body", description: "At the doctor, body parts", status: "locked", coins: 450 },
    { id: 13, title: "Comparatives", description: "Bigger, smaller, better than", status: "locked", coins: 500 },
    { id: 14, title: "Hobbies & Interests", description: "What you like to do", status: "locked", coins: 550 },
    { id: 15, title: "Weather & Seasons", description: "It's sunny, cold, raining", status: "locked", coins: 600 },
    { id: 16, title: "Work & Jobs", description: "What do you do? I work as...", status: "locked", coins: 650 }
  ],
  B1: [
    { id: 17, title: "Present Perfect", description: "Have you ever...? I have been", status: "completed", coins: 700 },
    { id: 18, title: "Modal Verbs", description: "Can, could, should, must", status: "completed", coins: 750 },
    { id: 19, title: "Conditional Sentences", description: "If I were you, I would...", status: "current", coins: 800 },
    { id: 20, title: "Passive Voice", description: "The book was written by...", status: "locked", coins: 850 },
    { id: 21, title: "Reported Speech", description: "He said that..., She told me", status: "locked", coins: 900 },
    { id: 22, title: "Articles & Determiners", description: "A, an, the, some, any", status: "locked", coins: 950 },
    { id: 23, title: "Phrasal Verbs", description: "Look up, give up, turn off", status: "locked", coins: 1000 },
    { id: 24, title: "Formal Writing", description: "Letters, emails, reports", status: "locked", coins: 1050 }
  ],
  B2: [
    { id: 25, title: "Complex Tenses", description: "Past perfect, future continuous", status: "completed", coins: 1100 },
    { id: 26, title: "Advanced Modals", description: "Must have, can't have, might", status: "completed", coins: 1150 },
    { id: 27, title: "Subjunctive Mood", description: "If I were..., I wish I had", status: "current", coins: 1200 },
    { id: 28, title: "Relative Clauses", description: "Who, which, that, whose", status: "locked", coins: 1250 },
    { id: 29, title: "Inversion", description: "Never have I seen, hardly had", status: "locked", coins: 1300 },
    { id: 30, title: "Cleft Sentences", description: "It was John who...", status: "locked", coins: 1350 },
    { id: 31, title: "Advanced Vocabulary", description: "Collocations, idioms", status: "locked", coins: 1400 },
    { id: 32, title: "Academic Writing", description: "Essays, research papers", status: "locked", coins: 1450 }
  ],
  C1: [
    { id: 33, title: "Mixed Conditionals", description: "Complex if-sentences", status: "completed", coins: 1500 },
    { id: 34, title: "Discourse Markers", description: "Furthermore, nevertheless", status: "completed", coins: 1550 },
    { id: 35, title: "Nominalization", description: "From verbs to nouns", status: "current", coins: 1600 },
    { id: 36, title: "Subtle Grammar", description: "Participle clauses, ellipsis", status: "locked", coins: 1650 },
    { id: 37, title: "Register & Style", description: "Formal vs informal language", status: "locked", coins: 1700 },
    { id: 38, title: "Metaphor & Irony", description: "Literary devices", status: "locked", coins: 1750 },
    { id: 39, title: "Nuanced Vocabulary", description: "Subtle differences in meaning", status: "locked", coins: 1800 },
    { id: 40, title: "Critical Writing", description: "Analysis and argumentation", status: "locked", coins: 1850 }
  ],
  C2: [
    { id: 41, title: "Linguistic Subtlety", description: "Fine distinctions in meaning", status: "completed", coins: 1900 },
    { id: 42, title: "Complex Syntax", description: "Multiple embedded clauses", status: "completed", coins: 1950 },
    { id: 43, title: "Stylistic Devices", description: "Alliteration, assonance", status: "current", coins: 2000 },
    { id: 44, title: "Historical Grammar", description: "Old forms and evolution", status: "locked", coins: 2050 },
    { id: 45, title: "Regional Varieties", description: "Dialects and accents", status: "locked", coins: 2100 },
    { id: 46, title: "Translation Skills", description: "Between languages", status: "locked", coins: 2150 },
    { id: 47, title: "Literary Analysis", description: "Deep textual analysis", status: "locked", coins: 2200 },
    { id: 48, title: "Native-like Fluency", description: "Master-level communication", status: "locked", coins: 2250 }
  ]
};

const LearningRoad = () => {
  const navigate = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<keyof typeof learningPaths>("B1");
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);

  const handleLessonClick = (lesson: typeof learningPaths.A1[0]) => {
    if (lesson.status === "locked") return;
    navigate.push(`/lesson/${lesson.id}`);
  };

  const currentLessons = learningPaths[selectedLevel];

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Level Selection */}
      <div className="mb-12 flex justify-center">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
          <div className="flex space-x-2">
            {Object.keys(learningPaths).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level as keyof typeof learningPaths)}
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
          {selectedLevel} Level
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {selectedLevel === "A1" && "Beginner level - Learn the basics of English communication"}
          {selectedLevel === "A2" && "Elementary level - Build on your foundation with practical skills"}
          {selectedLevel === "B1" && "Intermediate level - Develop confidence in everyday situations"}
          {selectedLevel === "B2" && "Upper-intermediate level - Master complex grammar and vocabulary"}
          {selectedLevel === "C1" && "Advanced level - Achieve sophisticated language skills"}
          {selectedLevel === "C2" && "Mastery level - Perfect your English to near-native fluency"}
        </p>
      </div>

      {/* Enhanced Road Background */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-12 rounded-full opacity-40" style={{ height: `${currentLessons.length * 120}px` }}>
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
              <div className={`w-80 ${isLeft ? 'mr-16' : 'ml-16'}`}>
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

      <CertificateSection selectedLevel={selectedLevel} />
    </div>
  );
};

export default LearningRoad;

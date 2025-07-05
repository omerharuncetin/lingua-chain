
import { Card } from "@/components/ui/card";
import { CheckCircle, Lock, Play } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description: string;
  status: string;
  coins: number;
}

interface LessonCardProps {
  lesson: Lesson;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const LessonCard = ({ lesson, isHovered, onClick, onMouseEnter, onMouseLeave }: LessonCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "current":
        return <Play className="w-5 h-5 text-cyan-400" />;
      case "locked":
        return <Lock className="w-5 h-5 text-slate-500" />;
      default:
        return null;
    }
  };

  const getCardStyle = (status: string, isHovered: boolean) => {
    let baseStyle = "group relative p-6 transition-all duration-300 cursor-pointer border rounded-2xl overflow-hidden backdrop-blur-sm ";
    
    switch (status) {
      case "completed":
        baseStyle += "bg-emerald-500/10 border-emerald-400/30 hover:border-emerald-400/50 hover:bg-emerald-500/15 ";
        if (isHovered) baseStyle += "scale-105 shadow-xl shadow-emerald-500/20";
        break;
      case "current":
        baseStyle += "bg-cyan-500/15 border-cyan-400/40 hover:border-cyan-300/60 hover:bg-cyan-500/20 ";
        if (isHovered) baseStyle += "scale-105 shadow-xl shadow-cyan-500/25";
        break;
      case "locked":
        baseStyle += "bg-slate-700/20 border-slate-600/20 cursor-not-allowed opacity-60";
        break;
    }
    
    return baseStyle;
  };

  const getTitleStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "text-lg font-semibold text-emerald-300";
      case "current":
        return "text-lg font-semibold text-cyan-300";
      case "locked":
        return "text-lg font-semibold text-slate-400";
      default:
        return "text-lg font-semibold text-white";
    }
  };

  return (
    <Card
      className={getCardStyle(lesson.status, isHovered)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon(lesson.status)}
          <h3 className={getTitleStyle(lesson.status)}>{lesson.title}</h3>
        </div>
        <div className="flex items-center space-x-1 bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/30">
          <span className="text-yellow-200 font-medium text-sm">{lesson.coins}</span>
        </div>
      </div>
    </Card>
  );
};

export default LessonCard;


import { Timer } from "lucide-react";

interface ExamTimerProps {
  timeLeft: number;
}

const ExamTimer = ({ timeLeft }: ExamTimerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className={`flex items-center justify-center space-x-2 border rounded-xl px-4 py-2 inline-flex ${
        timeLeft <= 300 ? 'bg-red-800/50 border-red-600/30' : 'bg-slate-800/50 border-slate-600/30'
      }`}>
        <Timer className={`w-5 h-5 ${timeLeft <= 300 ? 'text-red-400' : 'text-cyan-400'}`} />
        <span className={`font-mono text-lg ${timeLeft <= 300 ? 'text-red-400' : 'text-cyan-400'}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      {timeLeft <= 300 && (
        <p className="text-red-400 text-sm mt-2">Warning: Less than 5 minutes remaining!</p>
      )}
    </>
  );
};

export default ExamTimer;

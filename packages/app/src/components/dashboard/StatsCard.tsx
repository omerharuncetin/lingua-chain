
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  value: string;
  subtitle?: string;
  buttonText?: string;
  buttonColor?: string;
  onButtonClick?: () => void;
  progress?: {
    current: number;
    max: number;
    color: string;
  };
}

const StatsCard = ({
  icon: Icon,
  iconColor,
  title,
  value,
  subtitle,
  buttonText,
  buttonColor,
  onButtonClick,
  progress
}: StatsCardProps) => {
  return (
    <Card className="p-6 bg-slate-900/70 border border-slate-700/50 backdrop-blur-xl rounded-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className={`w-8 h-8 ${iconColor}`} />
        <div>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          <p className="text-sm text-slate-300">{title}</p>
        </div>
        {subtitle && (
          <div className="text-right text-sm text-slate-300 ml-auto">
            {subtitle}
          </div>
        )}
      </div>

      {progress && (
        <div className="w-full bg-slate-700/50 rounded-full h-2 mb-4">
          <div
            className={`${progress.color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${(progress.current / progress.max) * 100}%` }}
          ></div>
        </div>
      )}

      {buttonText && onButtonClick && (
        <Button
          disabled={true}
          onClick={onButtonClick}
          className={`w-full ${buttonColor} rounded-xl transition-all duration-300 hover:scale-105`}
        >
          {buttonText} <span className="badge badge-info">Soon</span>
        </Button>
      )}
    </Card>
  );
};

export default StatsCard;


import MultipleChoiceExercise from "@/components/exercises/MultipleChoiceExercise";
import FillBlankExercise from "@/components/exercises/FillBlankExercise";
import WordBuilderExercise from "@/components/exercises/WordBuilderExercise";
import AudioRecognitionExercise from "@/components/exercises/AudioRecognitionExercise";
import { LessonExercise } from "@/data/lessonData";

interface ExerciseRendererProps {
  exercise: LessonExercise;
  onComplete: (isCorrect: boolean) => void;
}

const ExerciseRenderer = ({ exercise, onComplete }: ExerciseRendererProps) => {
  switch (exercise.type) {
    case "multiple_choice":
      return (
        <MultipleChoiceExercise
          exercise={exercise}
          onComplete={onComplete}
        />
      );
    case "fill_blank":
      return (
        <FillBlankExercise
          exercise={exercise}
          onComplete={onComplete}
        />
      );
    case "word_builder":
      return (
        <WordBuilderExercise
          exercise={exercise}
          onComplete={onComplete}
        />
      );
    case "audio_recognition":
      return (
        <AudioRecognitionExercise
          exercise={exercise}
          onComplete={onComplete}
        />
      );
    default:
      return <div>Unknown exercise type</div>;
  }
};

export default ExerciseRenderer;

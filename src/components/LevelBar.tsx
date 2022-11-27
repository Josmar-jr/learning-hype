import type { QuizLevel } from "@prisma/client";

interface DifficultyBarProps {
  size?: number;
  level: QuizLevel;
}

export function LevelBar({ level }: DifficultyBarProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex items-end gap-[2px]">
        <span className="block h-2 w-1 rounded-sm bg-indigo-600" />
        <span
          className={`block h-3 w-1 rounded-sm ${
            level === "INTERMEDIATE" || level === "EXPERT"
              ? "bg-indigo-600"
              : "bg-gray-200"
          }`}
        />
        <span
          className={`block h-4 w-1 rounded-sm ${
            level === "EXPERT" ? "bg-indigo-600" : "bg-gray-200"
          }`}
        />
      </div>
      <p className="hidden lg:block">
        {level === "BEGINNER" && "Fácil"}
        {level === "INTERMEDIATE" && "Médio"}
        {level === "EXPERT" && "Expert"}
      </p>
    </div>
  );
}

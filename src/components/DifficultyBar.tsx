import type { CourseLevel } from "@prisma/client";

interface DifficultyBarProps {
  size?: number;
  difficulty: CourseLevel;
}

export function DifficultyBar({ difficulty }: DifficultyBarProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex items-end gap-[2px]">
        <span className="block h-2 w-1 rounded-sm bg-indigo-600" />
        <span
          className={`block h-3 w-1 rounded-sm ${
            difficulty === "MIDDLE" || difficulty === "ADVANCED"
              ? "bg-indigo-600"
              : "bg-gray-200"
          }`}
        />
        <span
          className={`block h-4 w-1 rounded-sm ${
            difficulty === "ADVANCED" ? "bg-indigo-600" : "bg-gray-200"
          }`}
        />
      </div>
      <p>
        {difficulty === "BEGINNER" && "Fácil"}
        {difficulty === "MIDDLE" && "Médio"}
        {difficulty === "ADVANCED" && "Avançado"}
      </p>
    </div>
  );
}

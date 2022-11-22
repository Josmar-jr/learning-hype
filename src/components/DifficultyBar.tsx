interface DifficultyBarProps {
  size?: number;
  difficulty: "beginner" | "middle" | "advanced";
}

export function DifficultyBar({ difficulty }: DifficultyBarProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex items-end gap-[2px]">
        <span className="block h-2 w-1 rounded-sm bg-indigo-600" />
        <span
          className={`block h-3 w-1 rounded-sm ${
            difficulty === "beginner" || difficulty === "advanced"
              ? "bg-indigo-600"
              : "bg-gray-200"
          }`}
        />
        <span
          className={`block h-4 w-1 rounded-sm ${
            difficulty === "advanced" ? "bg-indigo-600" : "bg-gray-200"
          }`}
        />
      </div>
      <p>{difficulty}</p>
    </div>
  );
}

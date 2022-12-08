import { Timer } from "phosphor-react";
import { useEffect } from "react";
import colors from "tailwindcss/colors";
import { useCountdown } from "../hooks/useCountdown";

interface CountdownProps {
  id: string;
  remainingTimeInSeconds?: number;
  onCountdownFinish?: () => void;
}

export function getColorBySecondsRemaining(seconds: number, color: string) {
  if (seconds >= 60) {
    return color;
  } else if (seconds > 30) {
    return colors.amber[500];
  }

  return colors.red[500];
}

export function Countdown({
  id,
  remainingTimeInSeconds,
  onCountdownFinish,
}: CountdownProps) {
  const { start, secondsLeft } = useCountdown({
    onCountdownFinish,
  });

  useEffect(() => {
    if (remainingTimeInSeconds) {
      start(new Date(), remainingTimeInSeconds);
    }
  }, [start, remainingTimeInSeconds, id]);

  const minutes = secondsLeft ? Math.floor(secondsLeft / 60) : 0;
  const seconds = secondsLeft ? secondsLeft % 60 : 0;

  return (
    <>
      <span
        className="inline-flex items-center justify-center gap-1 rounded-md py-1 px-2 font-bold text-white dark:bg-zinc-400"
        style={{
          color: getColorBySecondsRemaining(secondsLeft ?? 0, colors.zinc[900]),
        }}
      >
        <Timer size={26} className="" />
        <p className="mb-[1px]">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </p>
      </span>
    </>
  );
}

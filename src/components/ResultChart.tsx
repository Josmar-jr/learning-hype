import { useTheme } from "next-themes";
import colors from "tailwindcss/colors";
import { VictoryPie, VictoryLabel } from "victory";

interface ResultChartProps {
  score: number;
}

export function ResultChart({ score }: ResultChartProps) {
  const { theme } = useTheme();

  const valueInPercent = (score * 100) / 200;

  return (
    <div className="relative">
      <span className="absolute top-[106px] left-[116px] text-xl font-medium dark:text-zinc-100">
        Resultado
      </span>
      <svg viewBox="0 0 320 320" width={320} height={320}>
        <VictoryPie
          standalone={false}
          width={320}
          height={320}
          data={[
            { x: 1, y: valueInPercent },
            { x: 2, y: 100 - valueInPercent },
          ]}
          innerRadius={90}
          cornerRadius={40}
          padAngle={() => 5}
          style={{
            labels: { fill: "none" },
            data: {
              fill: ({ datum }) => {
                const color = colors.emerald[500];

                return datum.x === 1
                  ? color
                  : theme === "dark"
                  ? colors.zinc[700]
                  : colors.gray[200];
              },
            },
          }}
        />

        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={160}
          y={170}
          text={score}
          style={{
            fontSize: 64,
            fill: theme === "dark" ? colors.gray[100] : colors.gray[900],
            fontWeight: "bold",
            fontFamily: "Inter",
          }}
        />
      </svg>
    </div>
  );
}

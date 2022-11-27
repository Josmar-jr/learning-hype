import type { ComponentProps } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

export type RadioGroupAnswerProps = ComponentProps<typeof RadioGroup.Root> & {
  answerList: {
    id: string;
    description: string;
  }[];
};

export function RadioGroupAnswer({
  answerList,
  ...rest
}: RadioGroupAnswerProps) {
  return (
    <RadioGroup.Root className="mt-6 space-y-4" {...rest}>
      {answerList.map((answer) => (
        <RadioGroup.Item
          key={answer.id}
          value={answer.id}
          className="flex w-full items-center gap-2 rounded-md border border-gray-200 bg-gray-100 px-6 py-4 text-left 
                transition-colors checked:border-indigo-500 hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                focus:ring-offset-gray-100"
        >
          <div>
            <div className="h-6 w-6 rounded-full border-2 border-gray-200 bg-white">
              <RadioGroup.Indicator
                className="after:content[''] relative flex h-full w-full items-center
                  justify-center rounded-full border-4 bg-indigo-500 after:absolute after:block after:h-[11px] after:w-[11px]"
              />
            </div>
          </div>
          <p className="leading-relaxed text-zinc-800">{answer.description}</p>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}

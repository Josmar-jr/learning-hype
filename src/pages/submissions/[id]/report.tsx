import { useRouter } from "next/router";
import { Check, Spinner, X } from "phosphor-react";

import { trpc } from "~/utils/trpc";
import { ResultChart } from "~/components/ResultChart";

export function getLevelFromResult(result: number) {
  if (result >= 200) {
    return "Expert";
  } else if (result >= 100) {
    return "Proficiente";
  }

  return "Novato";
}

export default function Report() {
  const router = useRouter();
  const submissionId = String(router.query.id);

  const { data, isLoading } = trpc.useQuery([
    "submissionSession.report",
    {
      submissionId,
    },
  ]);

  const report = data!;

  const level = getLevelFromResult(report?.result);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center gap-2 text-zinc-400">
        <Spinner className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto mb-36 flex max-w-2xl flex-col items-stretch justify-center py-6 px-4">
        <div className="flex flex-col items-center justify-center">
          <ResultChart score={report?.result} />
        </div>

        <h1 className="text-center text-3xl font-bold dark:text-gray-100">
          {report?.quiz?.title}:{" "}
          <span className="text-indigo-400">{level}</span>
        </h1>

        <ol className="mt-6 flex flex-col items-stretch divide-y divide-zinc-700">
          {report?.report?.map((item) => {
            return (
              <li key={item.question.id} className="space-y-2 py-6">
                <strong className="leading-relaxed dark:text-zinc-300">
                  {item.question.description}
                </strong>
                <p className="flex items-baseline gap-2 leading-relaxed">
                  {item.userAnswer?.isRightAnswer ? (
                    <Check
                      weight="bold"
                      className="h-4 w-4 translate-y-0.5 text-emerald-400"
                    />
                  ) : (
                    <X className="h-4 w-4 translate-y-0.5 text-red-400" />
                  )}
                  <span className="flex-1 dark:text-zinc-400">{item.userAnswer?.description}</span>
                </p>

                {!item.userAnswer?.isRightAnswer && (
                  <p className="flex items-baseline gap-2 leading-relaxed">
                    <Check className="h-4 w-4 translate-y-0.5 text-emerald-400" />
                    <span className="flex-1">
                      {item?.rightAnswer?.description}
                    </span>
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}

import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import { useQueryClient } from "react-query";
import { RadioGroupAnswer } from "~/components/Form/RadioGroupAnswer";
import { useCallback, useState } from "react";
import { ArrowRight, Check, Spinner, VideoCamera, X } from "phosphor-react";
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

  const [isMasterclassBannerMinimized, setIsMasterclassBannerMinimized] =
    useState(false);

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
      {/* <NextSeo title={`Relatório: ${report.quiz?.title}`} noindex /> */}

      <div className="mx-auto mb-36 flex max-w-2xl flex-col items-stretch justify-center py-6 px-4">
        <div className="flex flex-col items-center justify-center">
          <ResultChart score={report?.result} />
        </div>

        <h1 className="text-center text-3xl font-bold">
          {report?.quiz?.title}:{" "}
          <span className="text-indigo-400">{level}</span>
        </h1>

        <ol className="mt-6 flex flex-col items-stretch divide-y divide-zinc-300">
          {report?.report?.map((item) => {
            return (
              <li key={item.question.id} className="space-y-2 py-6">
                <strong className="leading-relaxed">
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
                  <span className="flex-1">{item.userAnswer?.description}</span>
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

        {/* <div className="shadow-black fixed left-0 right-0 bottom-0 flex w-full max-w-2xl items-center justify-between gap-8 border border-zinc-700 bg-zinc-800 p-6 text-left shadow-2xl sm:bottom-8 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:gap-16 sm:rounded-lg">
          <button
            onClick={() => setIsMasterclassBannerMinimized(true)}
            className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex-1">
            <strong className="text-lg leading-relaxed text-zinc-100">
              Assistir Masterclass de React
            </strong>
            <p className="leading-relaxed text-zinc-300">
              Acelere sua evolução com uma <strong>Masterclass</strong> de 1
              hora em React e seu ecossistema!
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              className="bg-violet-600 hover:bg-violet-700 focus:ring-violet-400 inline-flex items-center justify-center gap-2 rounded-md px-8 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Assistir
              <ArrowRight />
            </button>
          </div>
        </div> */}

        <button
          onClick={() => setIsMasterclassBannerMinimized(false)}
          className="shadow-black fixed right-8 bottom-8 flex items-center justify-center gap-3 rounded-full border border-zinc-700 bg-zinc-800 px-6 py-3 shadow-2xl hover:bg-zinc-700"
        >
          <VideoCamera className="h-5 w-5 text-zinc-300" />
          <strong className="font-medium text-zinc-300">
            Masterclass de React
          </strong>
        </button>
      </div>
    </>
  );
}

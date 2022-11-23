import { Check, Spinner, Timer } from "phosphor-react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { trpcSSG } from "~/server/trpc-ssg";
import { useRouter } from "next/router";
import { Countdown } from "~/components/Countdown";
import { Button } from "~/components/Form/Button";
import type { inferQueryOutput } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";
import type { FormEvent } from "react";
import { useState, useCallback } from "react";
import { useQueryClient } from "react-query";

export default function Quiz() {
  const router = useRouter();
  const submissionId = String(router.query.id);
  const queryClient = useQueryClient();

  const [questionAnswerId, setQuestionAnswerId] = useState<string>();
  const [isFinishingQuiz, setIsFinishingQuiz] = useState(false);

  const {
    data: question,
    isLoading: isLoadingQuestion,
    refetch: fetchAnotherQuestion,
  } = trpc.useQuery(["submissionSession.fetchQuestion", { submissionId }], {
    onSuccess: (data) => {
      if (data.status === "finished") {
        setIsFinishingQuiz(true);
        router.push(`/submissions/${submissionId}/result`);
      }
    },
  });

  const { mutateAsync: sendAnswer, isLoading: isSendingAnswer } =
    trpc.useMutation("submissionSession.sendAnswer");

  async function handleSendAnswer(event: FormEvent) {
    event.preventDefault();

    if (!questionAnswerId || !question?.submissionQuestionAnswerId) {
      return;
    }

    await sendAnswer({
      submissionQuestionAnswerId: question.submissionQuestionAnswerId,
      answerId: questionAnswerId,
      submissionId,
    });

    await fetchAnotherQuestion();
  }

  // const onCountdownFinish = useCallback(() => {
  //   queryClient.setQueryData<inferQueryOutput<"submission.fetchQuestion">>(
  //     ["submission.fetchQuestion", { submissionId }],
  //     (data) => {
  //       return {
  //         ...data,
  //         status: "late",
  //       };
  //     }
  //   );
  // }, [submissionId, queryClient]);

  return (
    <div className="h-screen bg-gray-100">
      {isFinishingQuiz ? (
        <div className="flex h-screen w-screen items-center justify-center gap-2 text-zinc-400">
          <Spinner className="h-6 w-6 animate-spin" />
          Calculando resultado...
        </div>
      ) : (
        <>
          <h4 className="sr-only">Status</h4>

          <div aria-hidden="true">
            <div className="overflow-hidden rounded-sm bg-zinc-300">
              <div
                className="h-2 bg-indigo-500"
                style={{
                  width: `${
                    ((question?.currentQuestionNumber ?? 0) * 100) / 20
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-md p-3 font-medium">
              Questão 3 de 20
              <span
                className="hidden text-gray-400 sm:mx-1 sm:inline"
                aria-hidden="true"
              >
                &middot;
              </span>{" "}
              <strong className="block sm:inline">Fundamentos React</strong>
            </p>

            <div className="text-md align-right p-3 font-medium">
              {question?.remainingTimeInSeconds !== undefined &&
                question.remainingTimeInSeconds >= 0 && (
                  <Countdown
                    id={question.submissionQuestionAnswerId}
                    remainingTimeInSeconds={question.remainingTimeInSeconds}
                    onCountdownFinish={() => 120}
                  />
                )}
            </div>
          </div>

          <form
            className="mx-auto mt-4 max-w-4xl py-4 px-6"
            onSubmit={handleSendAnswer}
          >
            <h2 className="text-2xl font-bold">Questão 2</h2>
            {!isLoadingQuestion ? (
              <p className="mt-4 text-lg leading-8">{question?.description}</p>
            ) : (
              [0, 1, 2, 3, 4].map((item) => (
                <div className="w-full animate-pulse" key={item}>
                  <div className="mt-2 h-4 w-full rounded-sm bg-gray-200"></div>
                </div>
              ))
            )}

            <RadioGroup.Root
              className="mt-6 space-y-4"
              onValueChange={setQuestionAnswerId}
              value={questionAnswerId}
            >
              {isLoadingQuestion
                ? [0, 1, 2, 3].map((item) => (
                    <div className="w-full animate-pulse" key={item}>
                      <div className="h-16 w-full rounded-md bg-gray-200"></div>
                    </div>
                  ))
                : question?.answers?.map((answer) => (
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
                      <p className="leading-relaxed text-zinc-800">
                        {answer.description}
                      </p>
                    </RadioGroup.Item>
                  ))}
            </RadioGroup.Root>

            <div className="mt-6 grid grid-cols-2 gap-2 md:flex md:flex-row md:justify-end">
              <Button variant="outlined">Desistir</Button>

              <Button type="submit" isLoading={isSendingAnswer}>
                Confirmar resposta
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const submissionId = params?.id as string;

  await trpcSSG.prefetchQuery("submissionSession.get", { submissionId });
  const oi = await trpcSSG.prefetchQuery("submissionSession.fetchQuestion", {
    submissionId,
  });

  console.log(oi);

  return {
    props: {
      trpcState: trpcSSG.dehydrate(),
    },
  };
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: "blocking",
//   };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const slug = params?.slug as string;

//   await trpcSSG.prefetchQuery("question.getAll");

//   return {
//     props: {
//       trpcState: trpcSSG.dehydrate(),
//     },
//   };
// };

import { useState, useCallback } from "react";
import type { FormEvent } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { Spinner } from "phosphor-react";

import { trpcSSG } from "~/server/trpc-ssg";
import type { inferQueryOutput } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";

import { Button } from "~/components/Form/Button";
import { Countdown } from "~/components/Countdown";
import { RadioGroupAnswer } from "~/components/Form/RadioGroupAnswer";

export default function Quiz() {
  const router = useRouter();
  const submissionId = String(router.query.id) || " ";
  const queryClient = useQueryClient();

  const [questionAnswerId, setQuestionAnswerId] = useState("");
  const [isFinishingQuiz, setIsFinishingQuiz] = useState(false);

  const { data: submission } = trpc.useQuery([
    "submissionSession.get",
    { submissionId },
  ]);

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

  const { mutateAsync: giveUp, isLoading: isGivingUp } = trpc.useMutation(
    "submissionSession.giveUp",
    {
      async onSuccess() {
        await router.push("/");
      },
    }
  );

  const { mutateAsync: sendAnswer, isLoading: isSendingAnswer } =
    trpc.useMutation("submissionSession.sendAnswer");

  async function handleGiveUp() {
    if (confirm("Você realmente deseja desistir desse teste?")) {
      await giveUp({ submissionId });
    }
  }

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

  const onCountdownFinish = useCallback(() => {
    queryClient.setQueryData<
      inferQueryOutput<"submissionSession.fetchQuestion">
    >(["submission.fetchQuestion", { submissionId }], (data) => {
      return {
        ...data,
        status: "late",
      };
    });
  }, [submissionId, queryClient]);

  return (
    <div className="h-screen">
      {isFinishingQuiz ? (
        <div className="flex h-screen w-screen items-center justify-center gap-2 text-zinc-400">
          <Spinner className="h-6 w-6 animate-spin" />
          Calculando resultado...
        </div>
      ) : (
        <>
          <h4 className="sr-only">Status</h4>

          <div aria-hidden="true">
            <div className="overflow-hidden rounded-sm bg-zinc-300 dark:bg-zinc-600">
              {question?.quantityQuestions !== undefined && (
                <div
                  className="h-2 bg-indigo-500"
                  style={{
                    width: `${
                      ((question?.currentQuestionNumber ?? 0) * 100) /
                      question.quantityQuestions
                    }%`,
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-md p-3 font-medium dark:text-zinc-300">
              Questão {question?.currentQuestionNumber} de
              {question?.quantityQuestions}
              <span
                className="hidden text-gray-400 dark:text-zinc-300 sm:mx-1 sm:inline"
                aria-hidden="true"
              >
                &middot;
              </span>
              <strong className="block sm:inline">
                {submission?.quiz.title}
              </strong>
            </p>

            <div className="text-md align-right p-3 font-medium">
              {question?.remainingTimeInSeconds !== undefined &&
                question.remainingTimeInSeconds >= 0 && (
                  <Countdown
                    id={question.submissionQuestionAnswerId}
                    remainingTimeInSeconds={question.remainingTimeInSeconds}
                    onCountdownFinish={onCountdownFinish}
                  />
                )}
            </div>
          </div>

          <form
            className="mx-auto mt-4 max-w-4xl py-4 px-6"
            onSubmit={handleSendAnswer}
          >
            <h2 className="text-2xl font-bold dark:text-zinc-200">
              Questão {question?.currentQuestionNumber}
            </h2>
            {!isLoadingQuestion ? (
              <p
                className="mt-4 text-lg leading-8 dark:text-zinc-200"
                dangerouslySetInnerHTML={{
                  __html: question?.description || "",
                }}
              />
            ) : (
              [0, 1, 2, 3, 4].map((item) => (
                <div className="w-full animate-pulse" key={item}>
                  <div className="mt-2 h-4 w-full rounded-sm bg-gray-200"></div>
                </div>
              ))
            )}

            {isLoadingQuestion || !question?.answers ? (
              [0, 1, 2, 3].map((item) => (
                <div className="w-full animate-pulse" key={item}>
                  <div className="h-16 w-full rounded-md bg-gray-200"></div>
                </div>
              ))
            ) : (
              <RadioGroupAnswer
                onValueChange={setQuestionAnswerId}
                value={questionAnswerId}
                answerList={question?.answers}
              />
            )}

            <div className="mt-6 grid grid-cols-1 flex-1 gap-4 md:gap-2 md:flex md:flex-row md:justify-end">
              <Button
                onClick={handleGiveUp}
                disabled={isGivingUp}
                className="md:w-56 w-full"
                variant="outlined"
              >
                Desistir
              </Button>

              <Button
                className="md:w-56 w-full"
                type="submit"
                isLoading={isSendingAnswer}
                disabled={!questionAnswerId}
              >
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
  const submissionId = (params?.id as string) || "";

  await trpcSSG.prefetchQuery("submissionSession.get", { submissionId });
  await trpcSSG.prefetchQuery("submissionSession.fetchQuestion", {
    submissionId,
  });

  return {
    props: {
      trpcState: trpcSSG.dehydrate(),
    },
  };
};

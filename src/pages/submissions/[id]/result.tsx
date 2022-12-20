import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  FacebookLogo,
  InstagramLogo,
  NotePencil,
  TwitterLogo,
} from "phosphor-react";

import { trpcSSG } from "~/server/trpc-ssg";
import { trpc } from "~/utils/trpc";

import { Button } from "~/components/Form/Button";
import { ResultChart } from "~/components/ResultChart";
import {
  Modal,
  ModalTitle,
  ModalTrigger,
  ModalWrapper,
  ModalX,
} from "~/components/Modal";
import { useSession } from "next-auth/react";

const feedbackFormSchema = z.object({
  additionalInformation: z.string(),
  scoreFeedback: z.string(),
});

type FeedbackFormInputs = z.infer<typeof feedbackFormSchema>;

function getLevelFromResult(result: number) {
  if (result >= 200) {
    return "Expert";
  } else if (result >= 100) {
    return "Proficiente";
  }

  return "Novato";
}

const items = [
  {
    value: 1,
    memoji: "/very-sad.webp",
  },
  {
    value: 2,
    memoji: "/sad.webp",
  },
  {
    value: 3,
    memoji: "/ok.webp",
  },
  {
    value: 4,
    memoji: "/good.webp",
  },
  {
    value: 5,
    memoji: "/love.webp",
  },
];

export default function Result() {
  const router = useRouter();
  const { data: session } = useSession();

  const submissionId = String(router.query.id);
  const response = trpc.useQuery(["submission.result", { submissionId }]);
  const result = response.data!;

  const level = getLevelFromResult(result?.result);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = useForm<FeedbackFormInputs>({
    resolver: zodResolver(feedbackFormSchema),
  });

  async function onSendFeedback(data: FeedbackFormInputs) {
    if (session?.user) {
      await sendFeedback({
        additionalInformation: data.additionalInformation,
        score: Number(data.scoreFeedback),
        userId: session.user.id ?? "",
      });
    }
  }

  const { mutateAsync: sendFeedback } = trpc.useMutation([
    "feedback.sendFeedback",
  ]);

  return (
    <>
      <Head>
        <title>{`Resultado: ${result?.quizTitle} | Rocketseat`}</title>
      </Head>

      <div className="mx-auto flex h-screen max-w-lg flex-col items-stretch justify-center py-6 px-4 text-center">
        <div className="flex flex-col items-center justify-center">
          <ResultChart score={result?.result} />
        </div>

        <h1 className="text-3xl font-bold dark:text-gray-100">
          {result?.quizTitle}: <span className="text-indigo-400">{level}</span>
        </h1>

        <p className="text-md mt-2 text-zinc-400 ">
          Seu nível está acima de{" "}
          <span className="font-bold">{result?.betterThanPercentage}%</span> dos
          outros usuários
        </p>

        <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Modal>
            <ModalTrigger asChild>
              <Button className="w-60 flex-1">
                <NotePencil className="h-5 w-5" />
                Enviar feedback
              </Button>
            </ModalTrigger>

            <ModalWrapper maintainDimensions>
              <ModalX />

              <h4 className="mt-4 text-zinc-500">
                Dê a sua opinião para nossa melhora
              </h4>

              <ModalTitle className="dark:text-zinc-200">
                Como está sendo a sua experiência com o Hypertiguer?
              </ModalTitle>

              <form onSubmit={handleSubmit(onSendFeedback)}>
                <RadioGroup.Root
                  onValueChange={(scoreFeedbackValue) =>
                    setValue("scoreFeedback", scoreFeedbackValue)
                  }
                >
                  {items.map((item) => (
                    <RadioGroup.Item
                      className="relative rounded-sm outline-none focus:ring-2 focus:ring-indigo-600"
                      key={item.value}
                      value={String(item.value)}
                    >
                      <img
                        src={item.memoji}
                        alt="memoji"
                        className="w-20 opacity-70 brightness-50"
                      />
                      <RadioGroup.Indicator className="absolute top-0 left-0 transition-all ">
                        <motion.img
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          transition={{ duration: 0.1, type: "spring" }}
                          src={item.memoji}
                          alt="memoji"
                          className="w-20 drop-shadow-2xl transition-all"
                        />
                      </RadioGroup.Indicator>
                    </RadioGroup.Item>
                  ))}
                </RadioGroup.Root>

                <span className="mb-5 font-semibold">
                  {watch("scoreFeedback") === "1" && (
                    <span className="mb-5 font-semibold text-red-500">
                      Tá péssima!
                    </span>
                  )}
                  {watch("scoreFeedback") === "2" && (
                    <span className="mb-5 font-semibold text-amber-600">
                      Nada legal.
                    </span>
                  )}
                  {watch("scoreFeedback") === "3" && (
                    <span className="mb-5 font-semibold text-amber-400">
                      Aceitável.
                    </span>
                  )}
                  {watch("scoreFeedback") === "4" && (
                    <span className="text-emerald-400">Muito boa!</span>
                  )}
                  {watch("scoreFeedback") === "5" && (
                    <span className="mb-5 font-semibold text-emerald-400">
                      Realmente incrível!
                    </span>
                  )}
                </span>

                <hr className="mb-4 w-full border-t border-zinc-300 dark:border-zinc-700" />

                <span className="text-zinc-500">
                  Quanto mais informações, mais conseguimos evoluir
                </span>

                <textarea
                  {...register("additionalInformation")}
                  className="border-zinc mt-4 min-h-[120px] w-full resize-none rounded-md border border-zinc-200 bg-gray-200 py-1 px-2 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                />

                <Button
                  type="submit"
                  className="mt-6 w-52"
                  isLoading={isSubmitting}
                >
                  Enviar feedback
                </Button>
              </form>
            </ModalWrapper>
          </Modal>

          <Button variant="secondary" className="w-60 flex-1" asChildren>
            <Link href={`/submissions/${submissionId}/report`}>
              <BookOpen className="h-5 w-5" />
              Análise completa
            </Link>
          </Button>
        </div>

        <div className="relative my-6 mx-12">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-zinc-400 dark:border-zinc-600" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-100 px-4 text-sm font-semibold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-300">
              Compartilhe
            </span>
          </div>
        </div>

        <div className="text-md text-gray-500 inline space-x-4">
          <a href="#" className="hover:text-violet-300 text-zinc-400">
            <span className="sr-only">Facebook</span>
            <FacebookLogo className="inline h-6 w-6 hover:text-indigo-500" />
          </a>
          <a href="#" className="hover:text-violet-300 text-zinc-400">
            <span className="sr-only">Instagram</span>
            <InstagramLogo className="inline h-6 w-6 hover:text-indigo-500" />
          </a>
          <a href="#" className="hover:text-violet-300 text-zinc-400">
            <span className="sr-only">Twitter</span>
            <TwitterLogo className="inline h-6 w-6 hover:text-indigo-500" />
          </a>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const submissionId = params?.id as string;

  await trpcSSG.prefetchQuery("submission.result", { submissionId });

  return {
    props: {
      trpcState: trpcSSG.dehydrate(),
    },
  };
};

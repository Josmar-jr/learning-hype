import { ArrowRight, Check, ClockAfternoon, ListBullets } from "phosphor-react";
import { Trigger } from "@radix-ui/react-dialog";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { trpc } from "../../../utils/trpc";
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { trpcSSG } from "~/server/trpc-ssg";
import { useRouter } from "next/router";
import Image from "next/image";

import hypetiguerLogoImg from "~/assets/logo.svg";
import { Button } from "~/components/Form/Button";
import { ModalCredentials } from "~/components/ModalCredencials";
import { useSession } from "next-auth/react";

export default function Quiz() {
  const router = useRouter();
  const slug = String(router.query.slug);

  const session = useSession();
  const isAuthenticated = session.data?.user

  const { data } = trpc.useQuery(["quiz.get", { slug }]);
  const quiz = data!;

  const { mutateAsync: startSubmission, isLoading: isStartingSubmission } =
    trpc.useMutation(["submission.start"], {
      async onSuccess(data) {
        await router.push(`/submissions/${data.submissionId}`);
      },
      async onError() {
        await router.push(`/`);
      },
    });

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col items-center py-24 px-8 text-zinc-100">
      <Image src={hypetiguerLogoImg} alt="" width={160} />

      <img className="mt-16 w-36" src={quiz.imageUrl} alt="logo" />

      <h1 className="mt-8 text-center text-2xl font-bold leading-tight text-zinc-900 sm:text-4xl">
        Desafio: {quiz?.title}
      </h1>

      <div className="mt-2 flex divide-x divide-gray-400 text-zinc-400">
        <span className="inline-flex items-center gap-2 px-4 text-sm">
          <ClockAfternoon />
          10 - 40min
        </span>

        <span className="inline-flex items-center gap-2 px-4 text-sm">
          <ListBullets />
          {quiz?._count?.questions} questões
        </span>
      </div>

      <p className="mt-4 text-center leading-relaxed text-zinc-500">
        {quiz?.description}
      </p>

      {isAuthenticated ? (
        <Button
          className="mt-8 w-56"
          onClick={() => startSubmission({ quizId: quiz.id })}
          isLoading={isStartingSubmission}
        >
          Iniciar quiz

          <ArrowRight />
        </Button>
      ) : (
        <ModalCredentials />
      )}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  await trpcSSG.prefetchQuery("quiz.getAll");
  await trpcSSG.prefetchQuery("quiz.get", { slug });

  return {
    props: {
      trpcState: trpcSSG.dehydrate(),
    },
  };
};

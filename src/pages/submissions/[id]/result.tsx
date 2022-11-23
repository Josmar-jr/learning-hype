import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";

import {
  BookOpen,
  FacebookLogo,
  Fingerprint,
  GithubLogo,
  InstagramLogo,
  Question,
  TwitterLogo,
} from "phosphor-react";

import { trpcSSG } from "~/server/trpc-ssg";
import { trpc } from "~/utils/trpc";

import { Button } from "~/components/Form/Button";
import { ResultChart } from "~/components/ResultChart";

function getLevelFromResult(result: number) {
  if (result >= 200) {
    return "Expert";
  } else if (result >= 100) {
    return "Proficiente";
  }

  return "Novato";
}

export function DialogCredentials() {
  function handleSignIn(event: React.FormEvent) {
    event.preventDefault();

    signIn("github");
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary" className="mx-auto mt-4 w-full max-w-sm">
          <BookOpen className="h-5 w-5" />
          Visualizar relátorio
        </Button>
      </Dialog.Trigger>

      <Dialog.Overlay className="fixed inset-0 z-20 bg-[#050206] opacity-70" />

      <Dialog.Content className="fixed top-1/2 left-1/2 z-50 flex h-full w-full max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-lg bg-gray-100 py-6 px-4 text-center md:h-auto">
        <span className="mb-6 rounded-full bg-gray-200 p-4 text-gray-100">
          <Fingerprint size={32} weight="bold" />
        </span>

        <Dialog.Title className="text-2xl font-bold">
          Entre com o Gihub!
        </Dialog.Title>
        <Dialog.Description className="text-zinc-400">
          <p className="py-2 text-gray-800">
            Faça login com o Gihub na plataforma para visualizar o seu
            desempenho
          </p>

          <ul className="flex list-disc flex-col items-center text-left">
            <li>Emitir relátorio em formato PDF</li>
            <li>Receba feedbacks constantes</li>
            <li>Salvar as questões que respondeu</li>
            <li>Ter um panorama geral de acertos e erros</li>
          </ul>
        </Dialog.Description>

        <form
          onSubmit={handleSignIn}
          className="mt-8 flex w-full flex-col justify-center gap-2 sm:flex-row-reverse"
        >
          <Button type="submit" className="w-full sm:w-64" variant="secondary">
            <GithubLogo className="h-5 w-5" />
            Entrar com Github
          </Button>
          <Dialog.Close asChild>
            <Button className="w-full sm:w-64" variant="outlined">
              Cancelar
            </Button>
          </Dialog.Close>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default function Result() {
  const router = useRouter();
  const submissionId = String(router.query.id);
  const session = useSession();
  const isAuthenticated = !!session.data;

  const response = trpc.useQuery(["submission.result", { submissionId }]);
  const result = response.data!;

  const level = getLevelFromResult(result?.result);

  return (
    <>
      <Head>
        <title>{`Resultado: ${result?.quizTitle} | Rocketseat`}</title>
      </Head>

      <div className="mx-auto flex h-screen max-w-lg flex-col items-stretch justify-center py-6 px-4 text-center">
        <div className="flex flex-col items-center justify-center">
          <ResultChart score={result?.result} />
        </div>

        <h1 className="text-3xl font-bold">
          {result?.quizTitle}: <span className="text-indigo-400">{level}</span>
        </h1>

        <p className="text-md mt-2 text-zinc-400 ">
          Seu nível está acima de{" "}
          <span className="font-bold">{result?.betterThanPercentage}%</span> dos
          outros usuários
        </p>

        {isAuthenticated ? (
          <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Button className="w-60 flex-1">
              <Question size={22} weight="fill" />
              Ver gaparito
            </Button>

            <Button variant="secondary" className="w-60 flex-1">
              <BookOpen className="h-5 w-5" />
              Análise completa
            </Button>
          </div>
        ) : (
          <DialogCredentials />
        )}

        <div className="relative my-6 mx-12">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-zinc-400" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-100 px-4 text-sm font-semibold text-zinc-500">
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

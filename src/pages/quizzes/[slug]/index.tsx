import { useEffect } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  ArrowRight,
  ClockAfternoon,
  Fingerprint,
  GithubLogo,
  ListBullets,
} from "phosphor-react";
import { useTheme } from "next-themes";
import { signIn, useSession } from "next-auth/react";
import { trpcSSG } from "~/server/trpc-ssg";
import { motion } from "framer-motion";

import { trpc } from "~/utils/trpc";
import hypetiguerLogoImg from "~/assets/logo.svg";
import hypetiguerLogoDarkImg from "~/assets/logodark.svg";
import { Button } from "~/components/Form/Button";
import { parseCookies } from "nookies";
import {
  Modal,
  ModalClose,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
  ModalWrapper,
} from "~/components/Modal";

export default function Quiz() {
  const { theme } = useTheme();

  const router = useRouter();
  const slug = String(router.query.slug);

  const session = useSession();
  const isAuthenticated = session.data?.user;

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

  function handleSignIn(event: React.FormEvent) {
    event.preventDefault();

    signIn("github");
  }

  useEffect(() => {
    const t = parseCookies();
    console.log(t);
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 2,
        ease: "easeOut",
      }}
      className="mx-auto flex h-screen max-w-2xl flex-col items-center py-24 px-8 text-zinc-100"
    >
      <Image
        src={theme === "dark" ? hypetiguerLogoDarkImg : hypetiguerLogoImg}
        alt=""
        width={160}
      />

      <Image
        className="mt-16 w-36"
        src={quiz.imageUrl}
        alt="logo"
        width={144}
        height={144}
        quality={100}
      />

      <h1 className="mt-8 text-center text-2xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
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

      <p className="mt-4 text-center leading-relaxed text-zinc-500 dark:text-zinc-400">
        {quiz?.description}
      </p>

      {isAuthenticated ? (
        <Button
          className="group mt-8 w-56"
          onClick={() =>
            startSubmission({
              quizId: quiz.id,
              userId: session.data?.user?.id ?? "",
            })
          }
          isLoading={isStartingSubmission}
          autoFocus
        >
          Iniciar quiz
          <ArrowRight className="duration-200 ease-linear group-hover:translate-x-2" />
        </Button>
      ) : (
        <Modal>
          <ModalTrigger asChild>
            <Button className="group mt-8 w-56">
              Iniciar quiz
              <ArrowRight className="duration-200 ease-linear group-hover:translate-x-2" />
            </Button>
          </ModalTrigger>

          <ModalWrapper>
            <span className="mb-6 rounded-full bg-zinc-300 p-4 text-gray-100">
              <Fingerprint size={32} weight="bold" />
            </span>

            <ModalTitle className="text-2xl font-bold text-gray-900">
              Entre com o Gihub!
            </ModalTitle>
            <ModalDescription>
              <p className="py-2">
                É preciso efetuar o login com o Github para realizar o quiz!
              </p>
            </ModalDescription>

            <form
              onSubmit={handleSignIn}
              className="mt-8 flex w-full flex-col justify-center gap-2 sm:flex-row-reverse"
            >
              <Button
                type="submit"
                className="w-full sm:w-64"
                variant="secondary"
              >
                <GithubLogo className="h-5 w-5" />
                Entrar com Github
              </Button>
              <ModalClose asChild>
                <Button className="w-full sm:w-64" variant="outlined">
                  Cancelar
                </Button>
              </ModalClose>
            </form>
          </ModalWrapper>
        </Modal>
      )}
    </motion.div>
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

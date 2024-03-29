import Link from "next/link";
import Image from "next/image";
import type { GetStaticProps } from "next";
import type { Quiz } from "@prisma/client";
import { motion } from "framer-motion";
import { Check, Moon, PenNib, Sun } from "phosphor-react";
import { useTheme } from "next-themes";
import { NextSeo } from "next-seo";

import { trpc } from "~/utils/trpc";
import { itemVariants, listVariants } from "~/utils/animation";
import { trpcSSG } from "~/server/trpc-ssg";

import { LevelBar } from "~/components/LevelBar";

import hypetiguerLogoImg from "~/assets/logo.svg";
import hypetiguerLogoDarkImg from "~/assets/logodark.svg";

export default function Home() {
  const { data: quizzes } = trpc.useQuery(["quiz.getAll"]);

  const { systemTheme, theme, setTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <>
      <NextSeo
        title="Learning Hype"
        description="An app made to you exercise your knowledge in the world of technology and better, free!"
        canonical="https://learning-hype.vercel.app"
        openGraph={{
          url: "https://learning-hype.vercel.app",
          title: "Learning Hype",
          description:
            "An app made to you exercise your knowledge in the world of technology and better, free!",
          images: [
            {
              url: "https://learning-hype.vercel.app/logo.svg",
              width: 329,
              height: 84,
              alt: "Learning hype the best app for developers learning new things",
            },
          ],
          siteName: "Learning hype"
        }}
      />

      <main className="mx-auto flex h-screen max-w-2xl flex-col py-24 px-2 text-zinc-600 sm:px-8">
        {currentTheme === "dark" ? (
          <button
            className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center"
            onClick={() => setTheme("light")}
          >
            <Moon size={24} weight="fill" />
          </button>
        ) : (
          <button
            className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center"
            onClick={() => setTheme("dark")}
          >
            <Sun size={24} weight="fill" />
          </button>
        )}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
          }}
          className="px-2 md:px-0"
        >
          <Image
            src={
              currentTheme === "dark"
                ? hypetiguerLogoDarkImg
                : hypetiguerLogoImg
            }
            alt=""
            width={160}
          />

          <h2 className="mt-6 text-xl font-medium dark:text-gray-100">
            Qual teste você quer realizar?
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Inicie escolhendo um dos testes da lista abaixo
          </p>
        </motion.div>

        <motion.ul
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 w-full"
        >
          {quizzes?.map((quiz: Quiz) => (
            <motion.li
              key={quiz.id}
              variants={itemVariants}
              className="w-full border-t border-zinc-200 text-gray-400 first:border-none dark:border-zinc-800"
            >
              <Link
                href="/quizzes/[slug]"
                as={`quizzes/${quiz.slug}`}
                className="flex w-full items-center justify-start gap-4 rounded-sm py-4 px-2 transition-all hover:opacity-80 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-zinc-900"
              >
                <>
                  <img
                    className="w-full max-w-[48px]"
                    src={quiz.imageUrl}
                    alt="Image course"
                  />

                  <div className="w-full max-w-[296px]">
                    <span className="text-lg font-semibold text-zinc-800 dark:text-gray-100">
                      {quiz.title}
                    </span>
                    <div
                      className="text-sm leading-4 text-zinc-400"
                      dangerouslySetInnerHTML={{ __html: quiz.description }}
                    />
                  </div>

                  <div className="ml-2 md:ml-6">
                    <LevelBar level={quiz.level} />
                  </div>

                  <span className="ml-auto">
                    {quiz.published ? (
                      <span className="w-22 w-18 flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-2 py-1 text-xs font-semibold text-gray-100">
                        <Check weight="bold" />
                        <span className="hidden md:block">Publicado</span>
                      </span>
                    ) : (
                      <span className="w-22 w-18 flex items-center justify-center gap-2 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-gray-100">
                        <PenNib weight="fill" />
                        <span className="hidden md:block">Rascunho</span>
                      </span>
                    )}
                  </span>
                </>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  await trpcSSG.prefetchQuery("quiz.getAll");

  return {
    props: {
      trpcState: trpcSSG.dehydrate(),
    },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};

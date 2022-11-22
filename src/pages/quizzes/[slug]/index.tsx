import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { trpcSSG } from "~/server/trpc-ssg";
import { trpc } from "~/utils/trpc";

export default function Quizzes() {
  const router = useRouter();
  const slug = String(router.query.slug);

  const { data: trail } = trpc.useQuery([
    "trail.getTrailer",
    {
      slug,
    },
  ]);

  return (
    <div>
      {trail?.quizzes.map((quiz) => (
        <div key={quiz.id}>{quiz.title}</div>
      ))}
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

  await trpcSSG.prefetchQuery("trail.getAll");
  await trpcSSG.prefetchQuery("trail.getTrailer", { slug });

  return {
    props: {
      trpcState: trpcSSG.dehydrate(),
    },
  };
};

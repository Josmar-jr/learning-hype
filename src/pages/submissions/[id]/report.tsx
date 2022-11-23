import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";

export default function Report() {
  const router = useRouter();
  const submissionId = String(router.query.id);
  
  const { data } = trpc.useQuery([
    "submissionSession.report",
    {
      submissionId,
    },
  ]);

  return <div></div>;
}

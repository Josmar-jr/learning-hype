import { trpc } from "~/utils/trpc";

export default function Performance() {
  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col items-center py-24 px-2 text-zinc-600 sm:px-8">
      <div className="grid grid-cols-10 gap-2 rounded-md border border-zinc-200 bg-gray-100 p-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
          <li
            key={item}
            className="relative flex h-11 w-12  cursor-pointer flex-col items-center justify-center rounded-sm bg-gray-200 font-bold text-gray-900 transition-colors duration-300 hover:bg-gray-300"
          >
            {String(item).length === 1 ? `0${item}` : item}
            <span
              className={`absolute bottom-0 h-2 w-full rounded-b-sm  ${
                item % 2 === 0 ? "bg-red-500" : "bg-emerald-500"
              }`}
            />
          </li>
        ))}
      </div>
    </div>
  );
}

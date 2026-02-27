import Link from "next/link";

export interface Problem {
  title: string;
  difficulty: string;
  tags: string[];
  slug: string;
}

function Problems({ problems }: { problems: Problem[] }) {
  return (
    <div className="min-h-screen bg-black px-32 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((challenge) => (
          <div
            key={challenge.slug}
            className="group rounded-lg bg-neutral-950 p-6 shadow-bevel-s transition-colors duration-300 hover:bg-linear-to-b hover:shadow-bevel-l to-neutral-950 from-neutral-800/60"
          >
            <div className="flex flex-col justify-between sm:flex-row md:items-center">
              <h3 className="mr-2 mb-2 text-lg font-bold text-white/90">
                {challenge.title}
              </h3>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <span
                    className={`rounded-md px-3 py-1 text-sm ${
                      {
                        Easy: "bg-green-900/30 text-green-300",
                        Medium: "bg-amber-900/30 text-amber-400",
                        Hard: "bg-red-900/30 text-red-400",
                      }[challenge.difficulty] ?? "bg-neutral-800 text-neutral-200"
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center text-[#8c53e1]">
              <Link href={`/problem/${challenge.slug}`}>
                <div className="cursor-pointer border-0 bg-transparent text-[#8c53e1] duration-300 hover:bg-transparent hover:text-purple-400 hover:underline">
                  <span className="text-sm">Solve Challenge</span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Problems;

import Link from "next/link";
import { Niconne } from "next/font/google";

const niconne = Niconne({ weight: "400", subsets: ["latin"] });

export interface Problem {
  title: string;
  difficulty: string;
  tags: string[];
  slug: string;
}

function Problems({ problems }: { problems: Problem[] }) {
  return (
    <div className="min-h-screen bg-black px-32 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((challenge, index) => (
          <div
            key={index}
            className="bg-neutral-950 rounded-lg p-6 duration-300 transition-colors 
            shadow-bevel-s group hover:bg-linear-to-b to-neutral-950 from-neutral-900/20"
          >
            <div className="flex flex-col sm:flex-row md:items-center justify-between">
              <h3 className="text-lg font-bold mb-2 text-white/90 mr-2">
                {challenge.title}
              </h3>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span
                    className={`text-sm px-3 py-1 rounded-md ${
                      {
                        Easy: "bg-green-900/30 text-green-300",
                        Medium: "bg-amber-900/30 text-amber-400",
                        Hard: "bg-red-900/30 text-red-400",
                      }[challenge.difficulty]
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center text-[#8c53e1]">
              <Link href={`/problem/${challenge.slug}`}>
                <div className="text-[#8c53e1] cursor-pointer bg-transparent hover:bg-transparent hover:text-purple-400 hover:underline duration-300 border-0">
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

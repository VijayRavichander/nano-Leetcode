"use client";
import { useRouter } from "next/navigation";
import { Niconne } from "next/font/google";

const niconne = Niconne({ weight: "400", subsets: ["latin"] });


export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black">
      <section className="pt-32 pb-20 px-4 md:px-8 container mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7 mb-8 md:mb-0">
            <h1 className="text-8xl md:text-9xl font-bold tracking-tighter leading-none mb-6 text-white">
              LITECODE
            </h1>
            <p className="text-xl max-w-xl text-white/80">
              Practice. Precision. Progress.
            </p>
          </div>
        </div>
        <div className="mt-10 underline w-fit cursor-pointer text-xl text-white/80 hover:text-purple-400 transition-all duration-300" onClick={() => router.push("/problem")}>
          Problems
        </div>
      </section>
    </div>
  );
}

import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const pictures = [
  "sb.jpg",
  "cs.jpg",
  "ras.jpg",
  "aess.jpg",
  "ias.jpg",
  "wie.jpg"
];

export const pageAtom = atom(0);
export const pages = [
  {
    front: "book-cover.png",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back.png",
});

export const UI = ({ name }) => {
  const [page, setPage] = useAtom(pageAtom);

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  return (
    <>
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col">
        <div className="w-full overflow-auto pointer-events-auto flex justify-center">
          <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
            <button
              className={`
                 bg-black/30 text-white border-transparent hover:border-white transition-all duration-300
                   px-4 py-3 rounded-full  text-lg uppercase shrink-0 border 
          `}
            >
              Login
            </button>
          </div>
        </div>
      </main>
      <div className="fixed inset-0 flex items-center -rotate-2 select-none">
        <div className="relative">
          <div className="bg-white/0  animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            <h1 className="shrink-0 text-white text-10xl font-black ">
              IEEE
            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
              {name}
            </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">
              Student
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
              Branch
            </h2>
          </div>
          <div className="absolute top-0 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-8 px-8 w-max">
            <h1 className="shrink-0 text-white text-10xl font-black ">
              IEEE            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
              {name}  </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">
              Student            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
              Branch            </h2>

          </div>
        </div>
      </div>
    </>
  );
};

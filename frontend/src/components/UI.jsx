import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const pageAtom = atom(0);
export const pages = [
  {
    front: "",
    back: "",
  },
];

export const UI = ({ setVersion }) => {
  const [page, setPage] = useAtom(pageAtom);
  // const SaySomething = () => {
  //   const utterance = new SpeechSynthesisUtterance("Stay Tuned");
  //   speechSynthesis.speak(utterance);

  // }

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  return (
    <>
      <main className="pointer-events-none select-none fixed inset-0 flex flex-col justify-between z-10 bg-transparent">
        <div>
          <Link to="/">
            <button className="p-1 m-2 rounded text-white bg-blue-700 hover:bg-blue-800 pointer-events-auto">Back</button>
          </Link>
        </div>
        <div className="w-full absolute bottom-0 overflow-auto pointer-events-auto flex justify-center items-center gap-6 py-4 bg-white/20 backdrop-blur-sm">
          <button onClick={() => setVersion(1)} className="font-bold rounded-md hover:text-blue-700 transition">
            Version 1
          </button>
          <button onClick={() => setVersion(2)} className=" hover:text-red-700 transition font-bold">
            Version 2
          </button>
          <button onClick={() => setVersion(3)} className=" hover:text-blue-400 transition font-bold">
            Version 3
          </button>
       
        </div>
      </main>

      <div className="fixed inset-0 flex justify-center items-center -rotate-3 select-none overflow-hidden">
        <div className="relative w-full ">
          <div className="animate-horizontal-scroll flex items-center gap-10 px-8 whitespace-nowrap">
            <h1 className="shrink-0 text-black text-[5rem] font-black">IEEE CS</h1>
            <h2 className="shrink-0 text-black text-6xl italic font-light">ENICarthage</h2>
            <h2 className="shrink-0 text-black text-[4rem] font-bold">Student</h2>
            <h2 className="shrink-0 text-black text-[4rem] font-bold italic outline-white">Branch Chapter</h2>
          </div>

          <div className="absolute top-0 left-0 animate-horizontal-scroll-2 flex items-center gap-10 px-8 whitespace-nowrap">
            <h1 className="shrink-0 text-black text-[5rem] font-black drop-shadow-lg">IEEE CS</h1>
            <h2 className="shrink-0 text-black text-6xl italic font-light drop-shadow-lg">ENICarthage</h2>
            <h2 className="shrink-0 text-black text-[4rem] font-bold drop-shadow-lg">Student</h2>
            <h2 className="shrink-0 text-black text-[4rem] font-bold italic outline-text">Branch Chapter</h2>
          </div>
        </div>
      </div>

    </>
  );
};

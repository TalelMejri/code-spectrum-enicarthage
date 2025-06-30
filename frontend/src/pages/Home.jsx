import "../styles/home.css"
import ieee from "../assets/Full_White.png"
import Giscus from "@giscus/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    useEffect(() => {
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(isIOSDevice);

        const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
        setIsInstalled(isStandalone);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);


    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {

            }
            setDeferredPrompt(null);
        }
    };

    const IosInstall = () => {

    }

    return (
        <div className="home">
            <header className="flex justify-center pt-16">
                <figure>
                    <img src={ieee} />
                </figure>
            </header>
            <main>
                <div className="banner">
                    <h5 >@IEEE CS ENICarthage SBC {isInstalled}</h5>
                    <div>
                        <h1 className="left">Enjoy your reading</h1>
                        <h1 className="right">Code Spectrum</h1>
                    </div>
                    <h4>
                        Explore the diverse articles in
                        <br />Code Spectrum.
                    </h4>
                    <div className="flex gap-5">
                        <Link to="/landingPage">
                            <button >Check It</button>
                        </Link>
                        {
                            !isInstalled && (
                                <button onClick={isIOS ? IosInstall : handleInstallClick} >
                                    Download
                                </button>)
                        }

                    </div>
                    <canvas id="dotsCanvas"></canvas>
                </div>
                <div className="mx-auto max-w-lg rounded-xl p-6 text-center">
                    <p className="text-lg font-semibold text-white drop-shadow-sm">
                        Feel free to share your feedback about our code spectrum.
                    </p>
                    <p className="mt-2 text-sm text-purple-500">
                        Thank you for your support!
                    </p>
                </div>

                <div className="p-6 shadow-sm">
                    <Giscus
                        id="comments"
                        repo="TalelMejri/code-spectrum-enicarthage"
                        repoId="R_kgDOPD16hQ"
                        category="Announcements"
                        categoryId="DIC_kwDOPD16hc4CsNOH"
                        mapping="pathname"
                        strict="0"
                        reactionsEnabled="1"
                        emitMetadata="0"
                        inputPosition="bottom"
                        theme="catppuccin_latte"
                        lang="en"
                        crossorigin="anonymous"
                    />
                </div>
            </main>
        </div>

    );
}

export default Home;
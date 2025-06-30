import "../styles/home.css"
import ieee from "../assets/Full_White.png"
import Giscus from "@giscus/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from 'react-modal';
Modal.setAppElement('#root');
function Home() {
  
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

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
            closeModal();
        }
        closeModal();
    };


    return (
        <div className="home ">
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="flex text-center justify-center min-h-full items-center p-5 "
            >
                <div className="bg-[#2d2a44] text-white p-5 rounded shadow-md   ">
                    <h2 className="font-bold text-center">  Download App</h2>
                    {isIOS ? (
                        <div className="py-5 mt-5">
                            To install this application on your iPhone or iPad:
                            <ol className="list-decimal pl-5 mt-2">
                                <li>
                                    Tap the <strong>Share</strong> button in Safari.
                                </li>
                                <li>
                                    Select <strong>Add to Home Screen</strong>.
                                </li>
                                <li>
                                    Confirm by tapping <strong>Add</strong>.
                                </li>
                            </ol>
                            <div className="flex justify-end gap-5 py-5">
                                <button className="bg-transparent  hover:bg-[#1d1b34] border p-2 rounded " onClick={closeModal}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="py-5 mt-5">
                                Install our app for the best experience and quick access from your home screen.
                            </div>
                            <div className="flex justify-end gap-5 py-5">
                                <button className="bg-transparent  hover:bg-[#1d1b34] border p-2 rounded " onClick={closeModal}>Cancel</button>
                                <button className="bg-white text-[#1d1b34] border p-2 rounded  hover:bg-[#1d1b34] hover:text-white" onClick={handleInstallClick} >Download</button>
                            </div>
                        </div>

                    )}
                </div>
            </Modal>
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
                                <button onClick={openModal} >
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
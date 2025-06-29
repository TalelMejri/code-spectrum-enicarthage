import "../styles/home.css"
import ieee from "../assets/Primary.png"
function Home() {
    return (
        <div>
            <header className="flex justify-center pt-16">
                <figure>
                    <img src={ieee} />
                </figure>
            </header>
            <main>
                <div className="banner">
                    <h5 >@IEEE CS ENICarthage SBC</h5>
                    <div>
                        <h1 className="left">Enjoy your reading</h1>
                        <h1 className="right">Code Spectrum</h1>
                    </div>
                    <h4>
                        Explore the diverse articles in 
                        <br />Code Spectrum.
                    </h4>
                    <button>Check It</button>

                    <canvas id="dotsCanvas"></canvas>
                </div>
            </main>
        </div>

    );
}

export default Home;
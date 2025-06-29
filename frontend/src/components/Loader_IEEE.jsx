import '../styles/LoaderIEEE.css';
import Logo from "../assets/Ieee.png"
import { useEffect, useState } from 'react';
function LoaderIEEE() {
    const [showComp, SetComp] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            SetComp(false);
        }, 1);
        return () => clearTimeout(timer);
    }, []);


    return (
        showComp ? (
            <div className="loader-container">
                <img src={Logo} className="ieee-loader" alt="Loading..." />
            </div>
        ) : null
    );
}

export default LoaderIEEE;

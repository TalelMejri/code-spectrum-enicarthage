import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { Experience } from "../components/Experience";
import { UI } from "../components/UI";
import { Loader } from "@react-three/drei";
function SbsBook() {
    const [version, setVersion] = useState(2);
    return (
        < >
            <Loader />
            <UI version={version} setVersion={setVersion} />
            <Canvas shadows camera={{
                position: [-0.5, 1, window.innerWidth > 800 ? 4 : 7],
                fov: 45,
            }}>
                <group position-y={0}>
                    <Suspense fallback={null}>
                        <Experience key={version} version={version} />
                    </Suspense>
                </group>
            </Canvas>
        </>
    );
}

export default SbsBook;
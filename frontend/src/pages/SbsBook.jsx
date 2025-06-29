import React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "../components/Experience";
import { UI } from "../components/UI";
import { Loader } from "@react-three/drei";
import { useParams } from "react-router-dom";
function SbsBook() {
    const { id,name } = useParams();
    
    return (
        <>
            <Loader />
            <UI name={name}/>
            <Canvas shadows camera={{
                position: [-0.5, 1, window.innerWidth > 800 ? 4 : 7],
                fov: 45,
            }}>
                <group position-y={0}>
                    <Suspense fallback={null}>
                        <Experience bookId={id} />
                    </Suspense>
                </group>
            </Canvas>
        </>
    );
}

export default SbsBook;
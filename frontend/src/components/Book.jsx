import { useCursor, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { easing } from "maath";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { pageAtom, pages } from "./UI";

const easingFactor = 0.5; // Controls the speed of the easing
const easingFactorFold = 0.3; // Controls the speed of the easing
const insideCurveStrength = 0.18; // Controls the strength of the curve
const outsideCurveStrength = 0.05; // Controls the strength of the curve
const turningCurveStrength = 0.09; // Controls the strength of the curve

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71; // 4:3 aspect ratio
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  // ALL VERTICES
  vertex.fromBufferAttribute(position, i); // get the vertex
  const x = vertex.x; // get the x position of the vertex

  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH)); // calculate the skin index
  let skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH; // calculate the skin weight

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0); // set the skin indexes
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0); // set the skin weights
}

pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)
);
pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4)
);

const whiteColor = new Color("white");
const emissiveColor = new Color("orange");

const pageMaterials = [
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: "#111",
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
];

pages.forEach((page) => {
  useTexture.preload(`/textures/${page.front}`);
  useTexture.preload(`/textures/${page.back}`);
});

const Page = ({ number, front, back, page, opened, bookClosed, ...props }) => {
  const [picture, picture2, pictureRoughness] = useTexture([
    `/textures/${front}`,
    `/textures/${back}`,
  ]);
  picture.colorSpace = picture2.colorSpace = SRGBColorSpace;
  const group = useRef();
  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);

  const skinnedMeshRef = useRef();

  const manualSkinnedMesh = useMemo(() => {
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      let bone = new Bone();
      bones.push(bone);
      if (i === 0) {
        bone.position.x = 0;
      } else {
        bone.position.x = SEGMENT_WIDTH;
      }
      if (i > 0) {
        bones[i - 1].add(bone);
      }
    }
    const skeleton = new Skeleton(bones);

    const materials = [
      ...pageMaterials,
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture,
        ...(number === 0
          ? {
            roughnessMap: pictureRoughness,
          }
          : {
            roughness: 0.1,
          }),
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture2,
        ...(number === pages.length - 1
          ? {
            roughnessMap: pictureRoughness,
          }
          : {
            roughness: 0.1,
          }),
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
    ];
    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, []);


  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) {
      return;
    }

    const emissiveIntensity = highlighted ? 0.22 : 0;
    skinnedMeshRef.current.material[4].emissiveIntensity =
      skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
        skinnedMeshRef.current.material[4].emissiveIntensity,
        emissiveIntensity,
        0.1
      );

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();
      lastOpened.current = opened;
    }
    let turningTime = Math.min(400, new Date() - turnedAt.current) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) {
      targetRotation += degToRad(number * 0.8);
    }

    const bones = skinnedMeshRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;
      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;
      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);
      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }
      easing.dampAngle(
        target.rotation,
        "y",
        rotationAngle,
        easingFactor,
        delta
      );

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;
      easing.dampAngle(
        target.rotation,
        "x",
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      );
    }
  });

  const [_, setPage] = useAtom(pageAtom);
  const [highlighted, setHighlighted] = useState(false);
  useCursor(highlighted);

  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setPage(opened ? number : number + 1);
        setHighlighted(false);
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  );
};

export const Book = ({ version, ...props }) => {
  const [page] = useAtom(pageAtom);
  const [delayedPage, setDelayedPage] = useState(page);

  const allBooks = {
    "1": [
      "version1/02.png",
      "version1/03.png",
      "version1/04.png",
      "version1/05.png",
      "version1/06.png",
      "version1/07.png",
      "version1/08.png",
      "version1/09.png",
      "version1/10.png",
      "version1/11.png",
      "version1/12.png",
      "version1/13.png",
      "version1/14.png",
      "version1/15.png",
      "version1/16.png",
      "version1/17.png",
      "version1/18.png",
      "version1/19.png",
      "version1/20.png",
      "version1/21.png",
      "version1/22.png",
      "version1/23.png",
      "version1/24.png",
      "version1/25.png",
      "version1/26.png",
      "version1/27.png",
      "version1/28.png",
      "version1/29.png",
      "version1/30.png",
      "version1/31.png",
      "version1/32.png",
      "version1/33.png"
    ],
    "2": [
      "version2/02.png",
      "version2/03.png",
      "version2/04.png",
      "version2/05.png",
      "version2/06.png",
      "version2/07.png",
      "version2/08.png",
      "version2/09.png",
      "version2/10.png",
      "version2/11.png",
      "version2/12.png",
      "version2/13.png",
      "version2/14.png",
      "version2/15.png",
      "version2/16.png",
      "version2/17.png",
      "version2/18.png",
      "version2/19.png",
      "version2/20.png",
      "version2/21.png",
      "version2/22.png",
      "version2/23.png"
    ],
    "3": [
      "version3/02.png",
      "version3/03.png",
      "version3/04.png",
      "version3/05.png",
      "version3/06.png",
      "version3/07.png",
      "version3/08.png",
      "version3/09.png",
      "version3/10.png",
      "version3/11.png",
      "version3/12.png",
      "version3/13.png",
      "version3/14.png",
      "version3/15.png",
      "version3/16.png",
      "version3/17.png",
      "version3/18.png",
      "version3/19.png",
      "version3/20.png",
      "version3/21.png",
      "version3/22.png",
      "version3/23.png",
      "version3/24.png",
      "version3/25.png",
      "version3/26.png",
      "version3/27.png",
      "version3/28.png",
      "version3/29.png",
      "version3/30.png",
      "version3/31.png",
      "version3/32.png",
      "version3/33.png",
      "version3/34.png",
      "version3/35.png"
    ]
  };


  const pictures = allBooks[version] || allBooks["1"];
  const back = version == 1 ? "version1/34.png" : version == 2 ? "version2/23.png" : "version3/35.png";
  const front = version == 1 ? "version1/01.png" : version == 2 ? "version2/01.png" : "version3/01.png";
  const dynamicPages = useMemo(() => {
    const result = [{ front: front, back: pictures[0] }];
    for (let i = 1; i < pictures.length - 1; i += 2) {
      result.push({ front: pictures[i], back: pictures[i + 1] });
    }
    result.push({ front: pictures[pictures.length - 1], back: back });
    return result;
  }, [pictures]);


  useEffect(() => {
    let timeout;
    const goToPage = () => {
      setDelayedPage((delayedPage) => {
        if (page === delayedPage) return delayedPage;
        timeout = setTimeout(goToPage, Math.abs(page - delayedPage) > 2 ? 50 : 150);
        return page > delayedPage ? delayedPage + 1 : delayedPage - 1;
      });
    };
    goToPage();
    return () => clearTimeout(timeout);
  }, [page]);


  return (
    <group {...props} rotation-y={-Math.PI / 2}>
      {dynamicPages.map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === dynamicPages.length}
          {...pageData}
        />
      ))}
    </group>
  );
};
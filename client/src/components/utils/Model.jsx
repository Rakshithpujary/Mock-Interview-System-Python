import React, { useEffect, useState, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer, Clock } from 'three';
import { useFrame } from '@react-three/fiber';

const Model = ({ position = [0, 0, 0], scale = [0.17, 0.25, 0.17], path = '/robot1.glb', rotate = [0, 0, 0] }) => {
  const [gltf, setGltf] = useState(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(new Clock());

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(`/assets/3d_models${path}`, (loadedGltf) => {
      setGltf(loadedGltf);

      if (loadedGltf.animations.length > 0) {
        const mixer = new AnimationMixer(loadedGltf.scene);
        loadedGltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
        mixerRef.current = mixer;
      }
    });
  }, [path]);

  useFrame(() => {
    if (mixerRef.current) {
      mixerRef.current.update(clockRef.current.getDelta());
    }
  });

  return (
    <>
      {gltf && <primitive object={gltf.scene} position={position} scale={scale} rotation={rotate} />}
    </>
  );
};

export default Model;
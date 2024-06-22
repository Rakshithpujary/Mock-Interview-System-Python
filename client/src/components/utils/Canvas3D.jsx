import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from '@react-three/drei';
import React, {Suspense} from "react";
import Model from './Model';

function Canvas3D({ pos, scale, modelPath, classname, camControls = false }) {
  return (
    <Canvas className={classname}>
      <Suspense fallback={null}>
        {camControls && <OrbitControls />}
        <ambientLight intensity={0.3} />
        <pointLight position={[1,1,1]} />
        <Environment preset='forest' />
        <Model position={pos} scale={scale} path={modelPath} />
      </Suspense>
    </Canvas>
  );
}

export default Canvas3D;
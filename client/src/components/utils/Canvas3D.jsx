import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from '@react-three/drei';
import React, {Suspense} from "react";
import Model from './Model';

function Canvas3D({ pos, scale, modelPath, classname, preset='forest', camControls = false }) {
  return (
    <Canvas className={classname}>
      <Suspense fallback={null}>
        {camControls && <OrbitControls enableZoom={false} />}
        <ambientLight intensity={0.2} />
        <pointLight position={[1,1,1]} />
        <Environment preset={preset} />
        <Model position={pos} scale={scale} path={modelPath} />
      </Suspense>
    </Canvas>
  );
}

export default Canvas3D;
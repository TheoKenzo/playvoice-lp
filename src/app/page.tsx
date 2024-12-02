"use client";

import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three-stdlib";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TextureLoader } from "three";
import * as THREE from "three";
import { useRef, useEffect } from "react";

function LogoModel() {
  const obj = useLoader(OBJLoader, "/assets/PlayVoiceLogo.obj");
  const texture = useLoader(TextureLoader, "/assets/PlayVoiceLogoTexture.png");
  const ref = useRef<THREE.Group>(null!);
  const { camera } = useThree();
  const speed = 0.005;

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = ref.current.rotation.y + speed;
    }
  });

  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        (mesh.material as THREE.MeshStandardMaterial).map = texture;
        (mesh.material as THREE.MeshStandardMaterial).roughness = 0.2;
        (mesh.material as THREE.MeshStandardMaterial).metalness = 0.05;
      }
    }
  });

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(ref.current);
    const center = box.getCenter(new THREE.Vector3());
    ref.current.position.sub(center);

    const size = box.getSize(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);

    const distance = maxSize * 0.8;

    camera.position.z = distance;
  }, [camera, ref]);

  return <primitive object={obj} ref={ref} scale={2} />;
}

export default function Home() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/playvoice/PlayVoice.exe";
    link.download = "PlayVoice.exe";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="w-full min-h-screen bg-black flex flex-col items-center justify-center gap-16">
      <section className="flex flex-wrap items-center justify-center gap-10">
        <div className="flex flex-col gap-4 max-w-96">
          <h1 className="text-white font-bold text-4xl">
            Chega de partidas desorganizadas e jogadas frustradas.
          </h1>
          <p className="text-white">
            O Playvoice é o aplicativo revolucionário que conecta jogadores
            antes mesmo de a partida começar. Planeje estratégias imbatíveis com
            comunicação eficiente e jogadores alinhados.
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="w-[500px] h-[370px]">
            <Canvas>
              <ambientLight intensity={0.8} />
              <pointLight position={[5, 5, 5]} intensity={0.8} />
              <pointLight position={[-5, -5, 5]} intensity={0.8} />
              <OrbitControls />
              <LogoModel />
            </Canvas>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <p className="text-white font-bold text-3xl">
              Bem-vindo ao PlayVoice
            </p>
            <p className="text-[#A5A5A5]">
              O aplicativo definitivo de comunicação para gamers!
            </p>
          </div>
        </div>
      </section>
      <section>
        <div>
          <Button onClick={handleDownload} className="gap-2">
            <Download />
            Baixar para Windows
          </Button>
        </div>
      </section>
    </main>
  );
}

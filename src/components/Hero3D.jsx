import React, { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, ContactShadows, Environment, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const InteractiveNode = ({
  position,
  rotation,
  scale = 1,
  onClick,
  tooltip,
  floatIntensity = 0,
  color = '#0F9D58',
  geometry = 'box',
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const material = useRef();

  const geometryNode =
    geometry === 'sphere' ? (
      <sphereGeometry args={[0.55, 32, 32]} />
    ) : geometry === 'torus' ? (
      <torusGeometry args={[0.5, 0.16, 24, 100]} />
    ) : (
      <boxGeometry args={[0.95, 0.65, 0.2]} />
    );

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? scale * 1.05 : scale;
      meshRef.current.scale.setScalar(
        meshRef.current.scale.x + (targetScale - meshRef.current.scale.x) * 0.1
      );
    }
    if (material.current) {
      material.current.emissiveIntensity = hovered ? 0.85 : 0.3;
    }
  });

  const content = (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (onClick) {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        if (onClick) {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }
      }}
    >
      {geometryNode}
      <meshStandardMaterial
        ref={material}
        color={hovered ? '#f8fafc' : color}
        emissive={new THREE.Color(color)}
        emissiveIntensity={0.3}
        metalness={0.3}
        roughness={0.2}
      />
    </mesh>
  );

  return (
    <group>
      {floatIntensity > 0 ? (
        <Float speed={2} rotationIntensity={0.1} floatIntensity={floatIntensity}>
          {content}
        </Float>
      ) : content}
      
      {/* Tooltip for interactive objects */}
      {hovered && tooltip && (
        <Html position={[position[0], position[1] + 1, position[2]]} center className="pointer-events-none transition-opacity">
          <div className="bg-gfg-green/90 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-xl backdrop-blur-md">
            Click to view {tooltip}
          </div>
        </Html>
      )}
    </group>
  );
};

const Particles = () => {
  const particlesRef = useRef();
  const particles = useMemo(
    () =>
      Array.from({ length: 120 }).map((_, i) => {
        const seedA = Math.sin((i + 1) * 12.9898) * 43758.5453;
        const seedB = Math.sin((i + 1) * 78.233) * 96234.1234;
        const seedC = Math.sin((i + 1) * 39.425) * 12834.3491;
        const fracA = seedA - Math.floor(seedA);
        const fracB = seedB - Math.floor(seedB);
        const fracC = seedC - Math.floor(seedC);

        return {
          position: [(fracA - 0.5) * 14, (fracB - 0.5) * 8 + 2, (fracC - 0.5) * 14],
          size: 0.02 + (i % 10) * 0.0015,
          color: i % 2 === 0 ? '#0F9D58' : '#2563EB',
          opacity: 0.35 + (i % 6) * 0.05,
        };
      }),
    []
  );
  
  useFrame((state) => {
    if(particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh
          key={i}
          position={particle.position}
        >
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial
            color={particle.color}
            transparent
            opacity={particle.opacity}
          />
        </mesh>
      ))}
    </group>
  );
};

const HeroScene = () => {
  const navigate = useNavigate();

  return (
    <group position={[0, -0.6, 0]}>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 8, 4]}
        intensity={1.35}
        castShadow
        shadow-mapSize={1024}
        color="#e5e7eb"
      />
      <spotLight
        position={[-5, 6, 5]}
        intensity={1.8}
        penumbra={1}
        color="#0F9D58"
        angle={0.5}
      />
      <spotLight
        position={[5, 6, -4]}
        intensity={1.4}
        penumbra={1}
        color="#2563EB"
        angle={0.55}
      />

      <Particles />

      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[2.8, 3.2, 0.35, 64]} />
        <meshStandardMaterial color="#0b1220" metalness={0.2} roughness={0.7} />
      </mesh>

      <mesh position={[0, 0.22, 0]}>
        <torusGeometry args={[1.85, 0.07, 16, 120]} />
        <meshStandardMaterial color="#1d4ed8" emissive="#1d4ed8" emissiveIntensity={0.4} />
      </mesh>

      <InteractiveNode
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={1.05}
        color="#0F9D58"
        geometry="torus"
      />

      <InteractiveNode
        position={[-1.25, 1.25, 0.35]}
        rotation={[0.25, Math.PI / 7, 0]}
        scale={1}
        onClick={() => navigate('/resources')}
        tooltip="Resources"
        floatIntensity={0.42}
        color="#2563EB"
        geometry="box"
      />

      <InteractiveNode
        position={[1.35, 1.3, 0.15]}
        rotation={[0.2, -Math.PI / 5, 0.1]}
        scale={0.92}
        floatIntensity={0.5}
        onClick={() => navigate('/leaderboard')}
        tooltip="Leaderboard"
        color="#0F9D58"
        geometry="sphere"
      />

      <group position={[-1.8, 1.45, -0.4]} rotation={[0, Math.PI / 8, 0]}>
        <Float speed={2} floatIntensity={0.25} rotationIntensity={0.15}>
          <mesh
            castShadow
            onClick={(e) => {
              e.stopPropagation();
              navigate('/events');
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            <boxGeometry args={[1, 1.2, 0.1]} />
            <meshStandardMaterial
              color="#0b1220"
              emissive="#0F9D58"
              emissiveIntensity={0.35}
            />
            <mesh position={[0, 0.5, 0.06]}>
              <boxGeometry args={[1, 0.22, 0.02]} />
              <meshStandardMaterial color="#0F9D58" />
            </mesh>
            <Text position={[0, 0.1, 0.07]} fontSize={0.14} color="#e5e7eb">
              Events
            </Text>
            <Text position={[0, -0.2, 0.07]} fontSize={0.08} color="#94a3b8">
              Hackathon • DSA • Weekly
            </Text>
          </mesh>
        </Float>
      </group>

      <group position={[1.95, 1.45, -0.75]}>
        <Float speed={1.6} floatIntensity={0.2} rotationIntensity={0.15}>
          <mesh castShadow>
            <icosahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial color="#e2e8f0" emissive="#2563EB" emissiveIntensity={0.28} />
          </mesh>
          <Text position={[0, -0.72, 0]} fontSize={0.12} color="#94a3b8">
            Explore
          </Text>
        </Float>
      </group>

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.6}
        scale={10}
        blur={2.5}
        far={4}
        color="#020617"
      />
      <Environment preset="city" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2 + 0.1}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
    </group>
  );
};

const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 2, 6], fov: 50 }}>
        <Suspense
          fallback={
            <Html center>
              <div className="rounded-md border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 backdrop-blur">
                Loading 3D scene...
              </div>
            </Html>
          }
        >
          <HeroScene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Hero3D;

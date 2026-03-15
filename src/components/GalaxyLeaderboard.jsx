import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import StudentStar from './StudentStar';

const pseudoRandom = (seed) => {
  const s = Math.sin(seed * 91.347) * 41358.5453;
  return s - Math.floor(s);
};

const FloatingDust = () => {
  const pointsRef = useRef(null);
  const count = 320;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = pseudoRandom(i + 1) * 22;
      const a = pseudoRandom(i + 17) * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (pseudoRandom(i + 31) - 0.5) * 4;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#dbeafe" size={0.075} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
};

const LowPolyNebula = () => {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.025;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -1.2, -4]}>
        <icosahedronGeometry args={[6, 0]} />
        <meshBasicMaterial color="#2563EB" transparent opacity={0.11} wireframe />
      </mesh>
    </group>
  );
};

const GalaxyCore = ({ students, onSelect }) => {
  const groupRef = useRef(null);

  const maxScore = useMemo(() => Math.max(...students.map((s) => s.score)), [students]);

  const stars = useMemo(() => {
    return students.map((student, i) => {
      const arm = i % 2;
      const angle = i * 0.72 + arm * Math.PI;
      const radius = 1.3 + i * 0.52;
      const jitterR = (pseudoRandom(i + 101) - 0.5) * 1.1;
      const jitterY = (pseudoRandom(i + 47) - 0.5) * 0.55;

      const x = Math.cos(angle) * (radius + jitterR);
      const z = Math.sin(angle) * (radius + jitterR);
      return { student, position: [x, jitterY, z] };
    });
  }, [students]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 0, 0]} intensity={2.4} color="#60a5fa" distance={24} />
      <pointLight position={[0, 0, 0]} intensity={2.1} color="#22c55e" distance={14} />

      <mesh>
        <sphereGeometry args={[0.42, 20, 20]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>

      {stars.map(({ student, position }) => (
        <StudentStar
          key={student.id}
          student={student}
          position={position}
          maxScore={maxScore}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
};

const GalaxyLeaderboard = ({ students }) => {
  const [selected, setSelected] = useState(null);

  const cartoonStars = useMemo(() => {
    return Array.from({ length: 26 }).map((_, i) => ({
      id: i,
      top: `${Math.floor(pseudoRandom(i + 5) * 90)}%`,
      left: `${Math.floor(pseudoRandom(i + 15) * 94)}%`,
      size: 4 + Math.floor(pseudoRandom(i + 25) * 6),
      delay: `${(pseudoRandom(i + 35) * 3).toFixed(2)}s`,
      color: i % 2 === 0 ? '#86efac' : '#93c5fd',
    }));
  }, []);

  return (
    <div className="relative h-[640px] overflow-hidden rounded-[2rem] border-[3px] border-black bg-gradient-to-br from-[#0b1238] via-[#102a72] to-[#030817] shadow-[10px_10px_0_#000]">
      {cartoonStars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.color,
            boxShadow: `0 0 14px ${star.color}`,
            animation: `float-slow 3.4s ease-in-out infinite ${star.delay}, twinkle-soft 2.5s ease-in-out infinite ${star.delay}`,
          }}
        />
      ))}

      <Canvas camera={{ position: [0, 8, 14], fov: 52 }}>
        <ambientLight intensity={0.28} />
        <LowPolyNebula />
        <FloatingDust />
        <GalaxyCore students={students} onSelect={setSelected} />

        <OrbitControls
          enablePan={false}
          minDistance={8}
          maxDistance={18}
          minPolarAngle={0.7}
          maxPolarAngle={1.45}
          rotateSpeed={0.45}
        />
      </Canvas>

      <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/25 bg-black/35 px-3 py-2 text-xs font-black text-white/90 backdrop-blur">
        Cartoon Galaxy Mode • Drag to rotate • Click stars for details
      </div>

      {selected && (
        <div className="absolute bottom-5 left-1/2 w-[calc(100%-2.5rem)] max-w-lg -translate-x-1/2 rounded-2xl border-[3px] border-black bg-[var(--color-comic-cream)] p-4 shadow-[7px_7px_0_#000]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="display-comic text-2xl leading-tight">{selected.name}</div>
              <p className="mt-1 text-sm font-black text-black/70">Rank #{selected.rank} • Score {selected.score}</p>
              <p className="mt-2 text-sm font-extrabold">Problems Solved: {selected.problemsSolved}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="comic-outline-soft rounded-lg bg-white px-3 py-1 text-xs font-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalaxyLeaderboard;

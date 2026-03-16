import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SPARK_COUNT = 10;

const Sparks = ({ size, starId }) => {
  const ringARef = useRef(null);
  const ringBRef = useRef(null);

  const ringPositions = useMemo(() => {
    const arr = new Float32Array(SPARK_COUNT * 3);
    const r = size * 3.5;
    for (let i = 0; i < SPARK_COUNT; i++) {
      const a = (i / SPARK_COUNT) * Math.PI * 2;
      arr[i * 3]     = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.sin(i * 1.3) * size * 0.55;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [size]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringARef.current) {
      ringARef.current.rotation.y = t * 2.1;
      ringARef.current.rotation.x = Math.sin(t * 0.65) * 0.5;
      ringARef.current.material.opacity = 0.45 + 0.45 * Math.sin(t * 2.8 + starId * 0.6);
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.y = -t * 1.5;
      ringBRef.current.rotation.z = t * 0.55;
      ringBRef.current.material.opacity = 0.3 + 0.45 * Math.sin(t * 3.5 + starId * 1.1);
    }
  });

  return (
    <>
      <points ref={ringARef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={ringPositions} count={SPARK_COUNT} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#fde047" size={size * 0.44} transparent opacity={0.7} sizeAttenuation />
      </points>
      <points ref={ringBRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={ringPositions} count={SPARK_COUNT} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#facc15" size={size * 0.24} transparent opacity={0.5} sizeAttenuation />
      </points>
    </>
  );
};

const StudentStar = ({ student, position, maxScore, onSelect }) => {
  const groupRef = useRef(null);
  const coreMatRef = useRef(null);
  const glowMatRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const isTopRank = student.rank <= 3;
  const baseColor = isTopRank ? '#0F9D58' : '#2563EB';
  const normalized = Math.max(0.35, student.score / maxScore);
  const size = 0.18 + normalized * 0.38;
  const twinkleSpeed = 1.6 + (student.id % 5) * 0.23;
  const twinklePhase = student.id * 0.71;

  useEffect(() => {
    if (!hovered) {
      document.body.style.cursor = 'auto';
      return;
    }

    document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    const bob = Math.sin(t * 1.4 + student.id * 0.7) * 0.08;
    groupRef.current.position.y = position[1] + bob;

    const twinkle = 0.5 + 0.5 * Math.sin(t * twinkleSpeed + twinklePhase);
    const baseIntensity = isTopRank ? 1.9 : 1.35;
    const intensity = hovered ? 2.35 : baseIntensity + twinkle * (isTopRank ? 0.9 : 0.62);

    if (coreMatRef.current) {
      coreMatRef.current.emissiveIntensity = intensity;
    }

    if (glowMatRef.current) {
      glowMatRef.current.opacity = hovered ? 0.3 : 0.12 + twinkle * (isTopRank ? 0.2 : 0.12);
    }

    const targetScale = hovered ? 1.22 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 7 * delta);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(student);
      }}
    >
      <mesh>
        <sphereGeometry args={[size, 22, 22]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color="#ffffff"
          emissive={baseColor}
          emissiveIntensity={isTopRank ? 1.9 : 1.35}
          roughness={0.25}
          metalness={0.08}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[size * 1.9, 16, 16]} />
        <meshBasicMaterial
          ref={glowMatRef}
          color={baseColor}
          transparent
          opacity={isTopRank ? 0.22 : 0.14}
          side={THREE.DoubleSide}
        />
      </mesh>

      {isTopRank && <Sparks size={size} starId={student.id} />}
    </group>
  );
};

export default StudentStar;

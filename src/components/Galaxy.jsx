import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

// Mock student data for the galaxy
const studentData = [
  { id: 1, name: 'Alice Smith', score: 2450, rank: 1, color: '#FFD700' }, // Gold
  { id: 2, name: 'Bob Johnson', score: 2100, rank: 2, color: '#C0C0C0' }, // Silver
  { id: 3, name: 'Charlie Davis', score: 1950, rank: 3, color: '#CD7F32' }, // Bronze
  { id: 4, name: 'Diana King', score: 1800, rank: 4, color: '#0F9D58' },
  { id: 5, name: 'Evan Wright', score: 1650, rank: 5, color: '#0F9D58' },
  { id: 6, name: 'Fiona Ray', score: 1500, rank: 6, color: '#2563EB' },
  { id: 7, name: 'George Lee', score: 1420, rank: 7, color: '#2563EB' },
  { id: 8, name: 'Hannah Cole', score: 1350, rank: 8, color: '#9333EA' },
  { id: 9, name: 'Ian Bell', score: 1200, rank: 9, color: '#9333EA' },
  { id: 10, name: 'Julia Reed', score: 1150, rank: 10, color: '#e2e8f0' },
  // Adding more random students to fill the galaxy
  ...Array.from({ length: 40 }).map((_, i) => ({
    id: i + 11,
    name: `Student ${i + 11}`,
    score: Math.floor(Math.random() * 1000) + 100,
    rank: i + 11,
    color: '#64748b'
  }))
].sort((a, b) => b.score - a.score).map((student, idx) => ({ ...student, rank: idx + 1 }));

const StarNode = ({ student, position, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Size based strictly on score (normalized relative to max score)
  const maxScore = studentData[0].score;
  const baseSize = 0.12;
  const sizeMultiplier = Math.max(0.06, (student.score / maxScore) * 0.42);
  const size = baseSize + sizeMultiplier;

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle pulsing effect
      const pulse = Math.sin(state.clock.elapsedTime * 2 + student.id) * 0.05;
      meshRef.current.scale.setScalar(1 + pulse + (hovered ? 0.3 : 0));
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(student);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[size, 26, 26]} />
        <meshStandardMaterial 
          color={hovered ? '#f9fafb' : student.color}
          emissive={student.color}
          emissiveIntensity={hovered ? 2.25 : 1.2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Show name on hover in 3D space */}
      {hovered && (
        <Html position={[0, size + 0.2, 0]} center className="pointer-events-none">
          <div className="bg-slate-900/90 text-white px-3 py-1.5 rounded-lg border border-slate-700 whitespace-nowrap text-sm shadow-xl backdrop-blur-md z-50">
            <div className="font-bold text-gfg-green">{student.name}</div>
            <div className="text-xs text-slate-300">Rank: #{student.rank} | Score: {student.score}</div>
          </div>
        </Html>
      )}
    </group>
  );
};

const ParticleSystem = () => {
  const pointsRef = useRef();
  const particleCount = 2000;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
        // Spiral galaxy distribution for particles
        const radius = Math.random() * 15;
        const spinAngle = radius * 0.5;
        const branchAngle = ((Math.random() > 0.5 ? 0 : 1) * Math.PI) + (Math.random() * 0.5);
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius;

        pos[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        pos[i * 3 + 1] = randomY * 0.2; // Flatten the galaxy
        pos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        
        // Color based on distance from center
        const mixedColor = color.clone().lerpColors(
            new THREE.Color('#0F9D58'), // GfG Green near center
            new THREE.Color('#2563EB'), // Blue at edges
            radius / 15
        );
        col[i * 3] = mixedColor.r;
        col[i * 3 + 1] = mixedColor.g;
        col[i * 3 + 2] = mixedColor.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={positions.length / 3} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={colors.length / 3} 
          array={colors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        vertexColors 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const GalaxySystem = ({ onStudentClick }) => {
  const groupRef = useRef();

  // Generate spiral galaxy positions
  const studentsWithPositions = useMemo(() => {
    return studentData.map((student, i) => {
      // Golden ratio spiral distribution
      const theta = i * Math.PI * (1 + Math.sqrt(5)); // Golden angle
      const radius = 1 + Math.sqrt(i) * 0.8; // Spread out
      
      // Add some variance in the Y axis based on distance from center
      const yVariance = (Math.random() - 0.5) * (radius * 0.2); // Flatter galaxy

      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      
      return {
        ...student,
        position: new THREE.Vector3(x, yVariance, z)
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Slowly rotate the entire galaxy (students only, particles handled separately)
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <>
      <ParticleSystem />
      <group ref={groupRef}>
      {/* Center Blackhole/Core light */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#0F9D58" distance={10} />
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>

      {/* Connection lines to visualize structure (optional, keeping it clean for now) */}
      
      {studentsWithPositions.map((student) => (
        <StarNode 
          key={student.id} 
          student={student} 
          position={student.position} 
          onClick={onStudentClick}
        />
      ))}
      </group>
    </>
  );
};

const Galaxy = ({ onStudentClick }) => {
  return (
    <div className="w-full h-full relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-gfg-blue/5">
      <Canvas camera={{ position: [0, 8, 15], fov: 60 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.2} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <GalaxySystem onStudentClick={onStudentClick} />
        
        <OrbitControls 
          enablePan={false}
          maxDistance={30}
          minDistance={2}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 pointer-events-none">
        <span className="text-gfg-green font-bold">Code Galaxy</span>
        <br/>
        Drag to rotate • Scroll to zoom • Click stars for details
      </div>
    </div>
  );
};

export default Galaxy;
export { studentData };

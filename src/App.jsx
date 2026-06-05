import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import { Search, Star, Info } from 'lucide-react';
import './index.css';

// 3D Menu Card Component
function MenuCard({ position, rotation, title, index, active, setActive }) {
  const mesh = useRef();
  const hovered = useRef(false);

  useFrame((state, delta) => {
    // Animate scale on hover
    const targetScale = hovered.current ? 1.05 : 1;
    mesh.current.scale.x += (targetScale - mesh.current.scale.x) * 0.1;
    mesh.current.scale.y += (targetScale - mesh.current.scale.y) * 0.1;
    mesh.current.scale.z += (targetScale - mesh.current.scale.z) * 0.1;
    
    // Slight rotation animation
    mesh.current.rotation.y += Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.002;
  });

  return (
    <Float floatIntensity={2} rotationIntensity={0.5} speed={2}>
      <group position={position} rotation={rotation}>
        <mesh
          ref={mesh}
          onPointerOver={() => { hovered.current = true; document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { hovered.current = false; document.body.style.cursor = 'auto'; }}
          onClick={() => setActive(index)}
        >
          <boxGeometry args={[3, 1, 0.2]} />
          <meshStandardMaterial 
            color={active === index ? '#118c4f' : '#ffffff'} 
            roughness={0.2}
            metalness={0.1}
          />
          <Text
            position={[0, 0, 0.11]}
            fontSize={0.25}
            color={active === index ? '#ffffff' : '#1c1c1c'}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
          >
            {title}
          </Text>
        </mesh>
      </group>
    </Float>
  );
}

// Main 3D Scene
function Scene() {
  const [active, setActive] = useState(0);
  const menuCategories = [
    "Pizza & Pasta", "Snacks", "Bakery", "Sweets", "Drinks", "South Indian", "Chinese"
  ];

  return (
    <>
      <color attach="background" args={['#f8f9fa']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <group position={[0, -1, 0]}>
          {menuCategories.map((title, i) => (
            <MenuCard 
              key={i} 
              index={i}
              title={title} 
              active={active}
              setActive={setActive}
              position={[
                Math.sin((i / menuCategories.length) * Math.PI * 2) * 4,
                (i * 0.5) - 1.5,
                Math.cos((i / menuCategories.length) * Math.PI * 2) * 4
              ]}
              rotation={[0, (i / menuCategories.length) * Math.PI * 2, 0]}
            />
          ))}
        </group>
      </PresentationControls>

      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      <Environment preset="city" />
    </>
  );
}

// 2D HTML Overlay
function Overlay() {
  const categories = [
    { name: "Pizza & Pasta", count: 21 },
    { name: "Snacks", count: 15 },
    { name: "Bakery", count: 21 },
    { name: "Sweets", count: 20 },
    { name: "Drinks (Beverages)", count: 17 },
    { name: "South Indian", count: 38 },
    { name: "Chinese", count: 22 }
  ];

  return (
    <div className="ui-overlay">
      <header className="ui-header">
        <div>
          <div className="veg-badge" style={{ marginBottom: '0.5rem', width: 'fit-content' }}>
            <div className="veg-icon"></div>
            Pure Veg
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1>Milk Bar</h1>
            <Info size={24} color="#6c757d" />
          </div>
          <p style={{ color: '#6c757d', marginTop: '0.25rem' }}>46 km • Roorkee Locality</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ background: '#118c4f', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 'bold' }}>
              4.2 <Star size={14} fill="white" />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.25rem' }}>39.8K ratings</p>
          </div>
          <Search size={28} color="#1c1c1c" style={{ cursor: 'pointer' }} />
        </div>
      </header>

      <div className="menu-list-container">
        {categories.map((cat, i) => (
          <div className="menu-item" key={i}>
            <span className="menu-item-name">{cat.name} <span style={{color: '#118c4f'}}>+</span></span>
            <span className="menu-item-count">{cat.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <div className="canvas-container">
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
          <Scene />
        </Canvas>
      </div>
      <Overlay />
    </>
  );
}

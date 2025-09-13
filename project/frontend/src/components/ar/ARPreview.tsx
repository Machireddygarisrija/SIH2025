import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, OrbitControls } from '@react-three/drei';
import { X, VrIcon, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

interface ARPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityData: {
    title: string;
    company: string;
    location: string;
    description: string;
    images?: string[];
  };
}

// 3D Office Environment Component
function OfficeEnvironment({ opportunityData }: { opportunityData: any }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Office Floor */}
      <Box args={[10, 0.1, 10]} position={[0, -2, 0]}>
        <meshStandardMaterial color="#f0f0f0" />
      </Box>
      
      {/* Office Walls */}
      <Box args={[0.2, 4, 10]} position={[-5, 0, 0]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box args={[10, 4, 0.2]} position={[0, 0, -5]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      
      {/* Desks */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Box
          key={i}
          args={[1.5, 0.1, 0.8]}
          position={[
            (i % 3) * 2.5 - 2.5,
            -1.5,
            Math.floor(i / 3) * 2 - 1
          ]}
        >
          <meshStandardMaterial color="#8B4513" />
        </Box>
      ))}
      
      {/* Computers */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Box
          key={i}
          args={[0.3, 0.4, 0.02]}
          position={[
            (i % 3) * 2.5 - 2.5,
            -1.2,
            Math.floor(i / 3) * 2 - 1
          ]}
        >
          <meshStandardMaterial color="#2a2a2a" />
        </Box>
      ))}
      
      {/* Company Logo (floating) */}
      <Text
        position={[0, 2, -4.8]}
        fontSize={0.5}
        color="#3B82F6"
        anchorX="center"
        anchorY="middle"
      >
        {opportunityData.company}
      </Text>
      
      {/* Job Title (floating) */}
      <Text
        position={[0, 1, -4.8]}
        fontSize={0.3}
        color="#6B7280"
        anchorX="center"
        anchorY="middle"
      >
        {opportunityData.title}
      </Text>
    </group>
  );
}

export default function ARPreview({ isOpen, onClose, opportunityData }: ARPreviewProps) {
  const [isVRMode, setIsVRMode] = React.useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">AR Office Preview</h2>
                <p className="text-gray-600">{opportunityData.company} - {opportunityData.title}</p>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsVRMode(!isVRMode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    isVRMode 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <VrIcon className="h-4 w-4" />
                  <span>{isVRMode ? 'Exit VR' : 'VR Mode'}</span>
                </motion.button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* 3D Scene */}
          <div className="w-full h-full pt-20">
            <Canvas
              camera={{ position: [0, 2, 8], fov: 60 }}
              style={{ background: 'linear-gradient(to bottom, #87CEEB, #f0f8ff)' }}
            >
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              
              <OfficeEnvironment opportunityData={opportunityData} />
              
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={15}
              />
            </Canvas>
          </div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Office Environment</h3>
                <p className="text-sm text-gray-600 mb-2">{opportunityData.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>📍 {opportunityData.location}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AR Controls</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>🖱️ Click and drag to rotate view</p>
                  <p>🔍 Scroll to zoom in/out</p>
                  <p>👆 Right-click and drag to pan</p>
                  <p>🥽 Click VR Mode for immersive experience</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* VR Mode Overlay */}
          {isVRMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-blue-900/90 flex items-center justify-center"
            >
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4"
                >
                  <VrIcon className="w-full h-full" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">VR Mode Active</h3>
                <p className="text-purple-200 mb-4">
                  Experience the office environment in virtual reality
                </p>
                <div className="space-y-2 text-sm text-purple-100">
                  <p>🎯 Look around to explore the workspace</p>
                  <p>👥 See where your team would sit</p>
                  <p>💼 Visualize your future work environment</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
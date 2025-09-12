import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { VrIcon, X } from 'lucide-react';

interface ARPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityData: {
    title: string;
    company: string;
    location: string;
    images?: string[];
    description: string;
  };
}

export default function ARPreview({ isOpen, onClose, opportunityData }: ARPreviewProps) {
  const arSceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && arSceneRef.current) {
      // Initialize A-Frame scene
      const script = document.createElement('script');
      script.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
      script.onload = () => {
        initializeARScene();
      };
      document.head.appendChild(script);

      return () => {
        // Cleanup
        const existingScript = document.querySelector('script[src*="aframe"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [isOpen]);

  const initializeARScene = () => {
    if (!arSceneRef.current) return;

    const sceneHTML = `
      <a-scene 
        embedded 
        style="height: 100%; width: 100%;"
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true;"
      >
        <!-- Assets -->
        <a-assets>
          <a-mixin id="office-material" material="color: #4A90E2; metalness: 0.1; roughness: 0.8;"></a-mixin>
          <a-mixin id="text-material" material="color: white; shader: msdf;"></a-mixin>
        </a-assets>

        <!-- Lighting -->
        <a-light type="ambient" color="#404040" intensity="0.5"></a-light>
        <a-light type="directional" position="0 10 5" color="#ffffff" intensity="0.8"></a-light>

        <!-- AR Marker -->
        <a-marker preset="hiro" raycaster="objects: .clickable" emitevents="true" cursor="fuse: false; rayOrigin: mouse;">
          <!-- Office Building -->
          <a-box 
            position="0 0.5 0" 
            rotation="0 45 0" 
            color="#4A90E2" 
            animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
            class="clickable"
          >
            <a-text 
              value="${opportunityData.company}" 
              position="0 1.2 0" 
              align="center" 
              color="white"
              scale="0.5 0.5 0.5"
            ></a-text>
          </a-box>

          <!-- Floating Info Panels -->
          <a-plane 
            position="-2 1 0" 
            rotation="0 30 0" 
            width="1.5" 
            height="1" 
            color="#ffffff" 
            opacity="0.9"
            class="clickable"
          >
            <a-text 
              value="Role: ${opportunityData.title}" 
              position="0 0.2 0.01" 
              align="center" 
              color="black"
              scale="0.4 0.4 0.4"
            ></a-text>
            <a-text 
              value="Location: ${opportunityData.location}" 
              position="0 -0.2 0.01" 
              align="center" 
              color="black"
              scale="0.3 0.3 0.3"
            ></a-text>
          </a-plane>

          <!-- Interactive Elements -->
          <a-sphere 
            position="2 0.5 0" 
            radius="0.3" 
            color="#10B981" 
            animation="property: position; to: 2 1 0; dir: alternate; dur: 2000; loop: true"
            class="clickable"
          >
            <a-text 
              value="Apply Now!" 
              position="0 0.5 0" 
              align="center" 
              color="white"
              scale="0.3 0.3 0.3"
            ></a-text>
          </a-sphere>

          <!-- Animated Particles -->
          <a-entity id="particles">
            ${Array.from({ length: 10 }, (_, i) => `
              <a-sphere 
                position="${(Math.random() - 0.5) * 4} ${Math.random() * 2} ${(Math.random() - 0.5) * 4}" 
                radius="0.05" 
                color="#FFD700"
                animation="property: position; to: ${(Math.random() - 0.5) * 4} ${Math.random() * 3 + 1} ${(Math.random() - 0.5) * 4}; dur: ${3000 + Math.random() * 2000}; loop: true; dir: alternate"
              ></a-sphere>
            `).join('')}
          </a-entity>
        </a-marker>

        <!-- Camera -->
        <a-entity camera></a-entity>
      </a-scene>
    `;

    arSceneRef.current.innerHTML = sceneHTML;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <VrIcon className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">{opportunityData.title}</h3>
              <p className="text-sm opacity-80">{opportunityData.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* AR Scene */}
      <div ref={arSceneRef} className="w-full h-full" />

      {/* Instructions */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm p-4">
        <div className="text-white text-center">
          <p className="text-sm mb-2">Point your camera at a flat surface or use the Hiro marker</p>
          <div className="flex justify-center space-x-4 text-xs">
            <span>🎯 Tap objects to interact</span>
            <span>📱 Move device to explore</span>
            <span>✨ Look for floating elements</span>
          </div>
        </div>
      </div>

      {/* Fallback for non-AR devices */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
        <div className="text-center p-8">
          <VrIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">AR Preview</h3>
          <p className="text-gray-300 mb-4">
            Experience the internship location in augmented reality
          </p>
          <div className="bg-white/10 rounded-lg p-4 max-w-md">
            <h4 className="font-medium mb-2">{opportunityData.title}</h4>
            <p className="text-sm text-gray-300 mb-2">{opportunityData.company}</p>
            <p className="text-sm">{opportunityData.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
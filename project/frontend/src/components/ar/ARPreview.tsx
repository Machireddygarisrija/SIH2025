@@ .. @@
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
+  const [arSupported, setArSupported] = useState(false);
+  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
+    // Check for AR support
+    const checkARSupport = () => {
+      const hasWebXR = 'xr' in navigator;
+      const hasGetUserMedia = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
+      setArSupported(hasWebXR || hasGetUserMedia);
+    };
+
+    checkARSupport();
+
    if (isOpen && arSceneRef.current) {
      // Initialize A-Frame scene
      const script = document.createElement('script');
      script.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
      script.onload = () => {
-        initializeARScene();
+        const arScript = document.createElement('script');
+        arScript.src = 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar.min.js';
+        arScript.onload = () => {
+          initializeARScene();
+        };
+        document.head.appendChild(arScript);
      };
      document.head.appendChild(script);

+      // Request camera permission
+      requestCameraPermission();
+
      return () => {
        // Cleanup
        const existingScript = document.querySelector('script[src*="aframe"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
+        const existingARScript = document.querySelector('script[src*="aframe-ar"]');
+        if (existingARScript) {
+          document.head.removeChild(existingARScript);
+        }
      };
    }
  }, [isOpen]);

+  const requestCameraPermission = async () => {
+    try {
+      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
+      setCameraPermission('granted');
+      // Stop the stream immediately as we just needed permission
+      stream.getTracks().forEach(track => track.stop());
+    } catch (error) {
+      console.error('Camera permission denied:', error);
+      setCameraPermission('denied');
+    }
+  };

  const initializeARScene = () => {
    if (!arSceneRef.current) return;

    const sceneHTML = `
      <a-scene 
        embedded 
        style="height: 100%; width: 100%;"
-        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
+        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3; trackingMethod: best; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960;"
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true;"
+        gesture-detector
+        id="ar-scene"
      >
        <!-- Assets -->
        <a-assets>
          <a-mixin id="office-material" material="color: #4A90E2; metalness: 0.1; roughness: 0.8;"></a-mixin>
          <a-mixin id="text-material" material="color: white; shader: msdf;"></a-mixin>
+          <img id="office-texture" src="https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" crossorigin="anonymous">
+          <img id="company-logo" src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" crossorigin="anonymous">
        </a-assets>

        <!-- Lighting -->
        <a-light type="ambient" color="#404040" intensity="0.5"></a-light>
        <a-light type="directional" position="0 10 5" color="#ffffff" intensity="0.8"></a-light>

        <!-- AR Marker -->
        <a-marker preset="hiro" raycaster="objects: .clickable" emitevents="true" cursor="fuse: false; rayOrigin: mouse;">
+          <!-- 3D Office Building Model -->
+          <a-entity id="office-building" position="0 0 0">
+            <!-- Main building -->
+            <a-box 
+              position="0 1 0" 
+              width="2" 
+              height="2" 
+              depth="1.5"
+              material="src: #office-texture; repeat: 2 2"
+              animation="property: rotation; to: 0 360 0; loop: true; dur: 20000"
+              class="clickable"
+              gesture-handler
+            ></a-box>
+            
+            <!-- Company logo -->
+            <a-plane
+              position="0 2.2 0.76"
+              width="1.5"
+              height="0.5"
+              material="src: #company-logo; transparent: true"
+              look-at="[camera]"
+            ></a-plane>
+            
+            <!-- Entrance -->
+            <a-box
+              position="0 0.3 0.76"
+              width="0.6"
+              height="0.6"
+              depth="0.1"
+              color="#8B4513"
+            ></a-box>
+          </a-entity>

-          <!-- Office Building -->
-          <a-box 
-            position="0 0.5 0" 
-            rotation="0 45 0" 
-            color="#4A90E2" 
-            animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
-            class="clickable"
-          >
-            <a-text 
-              value="${opportunityData.company}" 
-              position="0 1.2 0" 
-              align="center" 
-              color="white"
-              scale="0.5 0.5 0.5"
-            ></a-text>
-          </a-box>

          <!-- Floating Info Panels -->
          <a-plane 
            position="-2 1 0" 
            rotation="0 30 0" 
            width="1.5" 
            height="1" 
            color="#ffffff" 
            opacity="0.9"
            class="clickable"
+            gesture-handler
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

+          <!-- Interactive Tour Points -->
+          <a-sphere 
+            position="1.5 0.5 0.5" 
+            radius="0.2" 
+            color="#FF6B6B" 
+            animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; dur: 1000; loop: true"
+            class="clickable tour-point"
+            gesture-handler
+            data-info="Reception Area - Welcome visitors and manage appointments"
+          >
+            <a-text 
+              value="Reception" 
+              position="0 0.4 0" 
+              align="center" 
+              color="white"
+              scale="0.3 0.3 0.3"
+            ></a-text>
+          </a-sphere>
+          
+          <a-sphere 
+            position="-1.5 0.5 -0.5" 
+            radius="0.2" 
+            color="#4ECDC4" 
+            animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; dur: 1000; loop: true; delay: 500"
+            class="clickable tour-point"
+            gesture-handler
+            data-info="Work Area - Collaborative workspace with modern amenities"
+          >
+            <a-text 
+              value="Workspace" 
+              position="0 0.4 0" 
+              align="center" 
+              color="white"
+              scale="0.3 0.3 0.3"
+            ></a-text>
+          </a-sphere>
+          
+          <a-sphere 
+            position="0 0.5 -1.2" 
+            radius="0.2" 
+            color="#45B7D1" 
+            animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; dur: 1000; loop: true; delay: 1000"
+            class="clickable tour-point"
+            gesture-handler
+            data-info="Meeting Room - Video conferencing and team discussions"
+          >
+            <a-text 
+              value="Meeting" 
+              position="0 0.4 0" 
+              align="center" 
+              color="white"
+              scale="0.3 0.3 0.3"
+            ></a-text>
+          </a-sphere>

          <!-- Interactive Elements -->
          <a-sphere 
            position="2 0.5 0" 
            radius="0.3" 
            color="#10B981" 
            animation="property: position; to: 2 1 0; dir: alternate; dur: 2000; loop: true"
            class="clickable"
+            gesture-handler
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
+          
+          <!-- Company Information Display -->
+          <a-plane
+            position="0 2.5 0"
+            width="3"
+            height="1"
+            color="#1a1a1a"
+            opacity="0.8"
+            look-at="[camera]"
+          >
+            <a-text
+              value="${opportunityData.company}"
+              position="0 0.2 0.01"
+              align="center"
+              color="#FFD700"
+              scale="0.6 0.6 0.6"
+            ></a-text>
+            <a-text
+              value="${opportunityData.description.substring(0, 80)}..."
+              position="0 -0.1 0.01"
+              align="center"
+              color="white"
+              scale="0.3 0.3 0.3"
+              wrap-count="40"
+            ></a-text>
+          </a-plane>
        </a-marker>

        <!-- Camera -->
        <a-entity camera></a-entity>
      </a-scene>
    `;

    arSceneRef.current.innerHTML = sceneHTML;
+    
+    // Add event listeners for interactions
+    setTimeout(() => {
+      const tourPoints = document.querySelectorAll('.tour-point');
+      tourPoints.forEach(point => {
+        point.addEventListener('click', (event) => {
+          const info = event.target.getAttribute('data-info');
+          showTourInfo(info);
+        });
+      });
+    }, 1000);
  };

+  const showTourInfo = (info: string) => {
+    // Create a temporary info display
+    const infoDiv = document.createElement('div');
+    infoDiv.className = 'fixed top-20 left-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50';
+    infoDiv.textContent = info;
+    
+    document.body.appendChild(infoDiv);
+    
+    setTimeout(() => {
+      document.body.removeChild(infoDiv);
+    }, 3000);
+  };

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
-      <div ref={arSceneRef} className="w-full h-full" />
+      {cameraPermission === 'granted' && arSupported ? (
+        <div ref={arSceneRef} className="w-full h-full" />
+      ) : (
+        <div className="flex items-center justify-center h-full">
+          {cameraPermission === 'denied' ? (
+            <div className="text-center text-white p-8">
+              <VrIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
+              <h3 className="text-xl font-semibold mb-2">Camera Permission Required</h3>
+              <p className="text-gray-300 mb-4">
+                Please allow camera access to experience AR preview
+              </p>
+              <button
+                onClick={requestCameraPermission}
+                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
+              >
+                Grant Camera Access
+              </button>
+            </div>
+          ) : !arSupported ? (
+            <div className="text-center text-white p-8">
+              <VrIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
+              <h3 className="text-xl font-semibold mb-2">AR Not Supported</h3>
+              <p className="text-gray-300 mb-4">
+                Your device doesn't support AR features. Please use a compatible browser.
+              </p>
+            </div>
+          ) : (
+            <div className="text-center text-white p-8">
+              <VrIcon className="h-16 w-16 mx-auto mb-4 animate-spin" />
+              <h3 className="text-xl font-semibold mb-2">Loading AR Experience</h3>
+              <p className="text-gray-300">Please wait while we initialize the AR scene...</p>
+            </div>
+          )}
+        </div>
+      )}

      {/* Instructions */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm p-4">
        <div className="text-white text-center">
-          <p className="text-sm mb-2">Point your camera at a flat surface or use the Hiro marker</p>
+          <p className="text-sm mb-2">Point your camera at the Hiro marker or print one from AR.js</p>
          <div className="flex justify-center space-x-4 text-xs">
-            <span>🎯 Tap objects to interact</span>
+            <span>🎯 Tap tour points for info</span>
            <span>📱 Move device to explore</span>
-            <span>✨ Look for floating elements</span>
+            <span>✨ Pinch to zoom objects</span>
          </div>
        </div>
      </div>

-      {/* Fallback for non-AR devices */}
-      <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
-        <div className="text-center p-8">
-          <VrIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
-          <h3 className="text-xl font-semibold mb-2">AR Preview</h3>
-          <p className="text-gray-300 mb-4">
-            Experience the internship location in augmented reality
-          </p>
-          <div className="bg-white/10 rounded-lg p-4 max-w-md">
-            <h4 className="font-medium mb-2">{opportunityData.title}</h4>
-            <p className="text-sm text-gray-300 mb-2">{opportunityData.company}</p>
-            <p className="text-sm">{opportunityData.description}</p>
-          </div>
-        </div>
-      </div>
+      {/* AR Marker Download Link */}
+      <div className="absolute top-20 right-4 z-10">
+        <a
+          href="https://ar-js-org.github.io/AR.js/data/images/hiro.png"
+          target="_blank"
+          rel="noopener noreferrer"
+          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
+        >
+          Download Marker
+        </a>
+      </div>
    </motion.div>
  );
}
// 3D Viewport Component for Coach Milo
// Implements studio PBR lighting, smooth camera damping, multiple view angles,
// software-WebGL safety guards, and exercise kinematics execution.

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { createCoachMiloRig, CoachMiloRig } from './CoachMiloCharacter';
import { computeCoachJointPose, JointPose } from './coachKinematics';

export type CameraViewMode = 'side' | 'front' | 'close_up';

export interface CoachMilo3DViewProps {
  exerciseId: string;
  isIntro?: boolean;
  isPlaying?: boolean;
  playbackSpeed?: number; // 0.5, 1, 1.25
  viewMode?: CameraViewMode;
  showVisualCues?: boolean;
  onCycleProgress?: (progress: number, formTip: string) => void;
  className?: string;
}

export interface CoachMilo3DViewRef {
  restartAnimation: () => void;
  setCameraView: (mode: CameraViewMode) => void;
}

// Exercise-specific camera framing to guarantee full-body visibility from head to sneakers
export function getExerciseCameraTargets(exerciseId: string, viewMode: CameraViewMode) {
  const id = (exerciseId || '').toLowerCase();

  // 1. Wall Push-Ups (Wall at z=0.95, body angled, feet at z=-0.35)
  if (id.includes('wall-push-up')) {
    if (viewMode === 'side') {
      return {
        pos: new THREE.Vector3(3.4, 1.15, 0.35),
        lookAt: new THREE.Vector3(0, 0.95, 0.35)
      };
    }
    if (viewMode === 'front') {
      return {
        pos: new THREE.Vector3(0, 1.25, 3.6),
        lookAt: new THREE.Vector3(0, 0.95, 0.35)
      };
    }
    // close_up
    return {
      pos: new THREE.Vector3(2.4, 1.1, 0.55),
      lookAt: new THREE.Vector3(0, 1.05, 0.5)
    };
  }

  // 2. Floor Push-Ups / Planks / Glute Bridges (Horizontal along Z)
  if (
    id.includes('push-up') ||
    id.includes('plank') ||
    id.includes('glute-bridge')
  ) {
    if (viewMode === 'side') {
      // 3/4 elevated view frames entire body from toes to head
      return {
        pos: new THREE.Vector3(3.4, 1.35, 0.1),
        lookAt: new THREE.Vector3(0, 0.45, 0.0)
      };
    }
    if (viewMode === 'front') {
      return {
        pos: new THREE.Vector3(0, 1.45, 3.4),
        lookAt: new THREE.Vector3(0, 0.45, 0.0)
      };
    }
    return {
      pos: new THREE.Vector3(2.3, 1.05, 0.25),
      lookAt: new THREE.Vector3(0, 0.45, 0.15)
    };
  }

  // 3. Incline Push-Ups & Bench Dips (Bench at z=0.55)
  if (id.includes('incline') || id.includes('dip')) {
    if (viewMode === 'side') {
      return {
        pos: new THREE.Vector3(3.4, 1.25, 0.3),
        lookAt: new THREE.Vector3(0, 0.65, 0.25)
      };
    }
    if (viewMode === 'front') {
      return {
        pos: new THREE.Vector3(0, 1.3, 3.4),
        lookAt: new THREE.Vector3(0, 0.65, 0.25)
      };
    }
    return {
      pos: new THREE.Vector3(2.4, 1.05, 0.4),
      lookAt: new THREE.Vector3(0, 0.65, 0.3)
    };
  }

  // 4. Jumping Jacks (Wide arms overhead to y=2.2, wide legs to x=±0.6)
  if (id.includes('jumping-jack')) {
    if (viewMode === 'side') {
      return {
        pos: new THREE.Vector3(3.8, 1.25, 0),
        lookAt: new THREE.Vector3(0, 1.1, 0)
      };
    }
    if (viewMode === 'front') {
      return {
        pos: new THREE.Vector3(0, 1.25, 4.0),
        lookAt: new THREE.Vector3(0, 1.1, 0)
      };
    }
    return {
      pos: new THREE.Vector3(2.5, 1.15, 0.6),
      lookAt: new THREE.Vector3(0, 1.1, 0)
    };
  }

  // 5. Standing Exercises (Squats, Lunges, Calf Raises, Warmup, Intro)
  if (viewMode === 'side') {
    return {
      pos: new THREE.Vector3(3.4, 1.15, 0.15),
      lookAt: new THREE.Vector3(0, 0.92, 0.0)
    };
  }
  if (viewMode === 'front') {
    return {
      pos: new THREE.Vector3(0, 1.15, 3.4),
      lookAt: new THREE.Vector3(0, 0.92, 0.0)
    };
  }
  return {
    pos: new THREE.Vector3(2.3, 0.95, 0.45),
    lookAt: new THREE.Vector3(0, 0.85, 0.05)
  };
}

export const CoachMilo3DView = forwardRef<CoachMilo3DViewRef, CoachMilo3DViewProps>(
  (
    {
      exerciseId,
      isIntro = false,
      isPlaying = true,
      playbackSpeed = 1.0,
      viewMode = 'side',
      showVisualCues = true,
      onCycleProgress,
      className = ''
    },
    ref
  ) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const rigRef = useRef<CoachMiloRig | null>(null);

    const currentLookAt = useRef(new THREE.Vector3(0, 0.9, 0));

    // Animation state
    const startTimeRef = useRef<number>(Date.now());
    const frameIdRef = useRef<number | null>(null);
    const isPlayingRef = useRef(isPlaying);
    const speedRef = useRef(playbackSpeed);
    const viewModeRef = useRef(viewMode);
    const showCuesRef = useRef(showVisualCues);
    const exerciseIdRef = useRef(exerciseId);
    const isIntroRef = useRef(isIntro);

    useEffect(() => {
      isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
      speedRef.current = playbackSpeed;
    }, [playbackSpeed]);

    useEffect(() => {
      viewModeRef.current = viewMode;
    }, [viewMode]);

    useEffect(() => {
      showCuesRef.current = showVisualCues;
    }, [showVisualCues]);

    useEffect(() => {
      exerciseIdRef.current = exerciseId;
      isIntroRef.current = isIntro;
      startTimeRef.current = Date.now();
    }, [exerciseId, isIntro]);

    useImperativeHandle(ref, () => ({
      restartAnimation: () => {
        startTimeRef.current = Date.now();
      },
      setCameraView: (mode: CameraViewMode) => {
        viewModeRef.current = mode;
      }
    }));

    useEffect(() => {
      if (!mountRef.current) return;
      const container = mountRef.current;
      const width = container.clientWidth || 640;
      const height = container.clientHeight || 360;

      // 1. Detect software WebGL
      const isSoftwareGl = (() => {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      })();

      // 2. Initialize Three.js Scene, Camera & Renderer
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x090d16); // Deep studio charcoal slate
      scene.fog = new THREE.FogExp2(0x090d16, 0.08);
      sceneRef.current = scene;

      const initialTargets = getExerciseCameraTargets(exerciseIdRef.current, viewModeRef.current);
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 20);
      camera.position.copy(initialTargets.pos);
      camera.lookAt(initialTargets.lookAt);
      currentLookAt.current.copy(initialTargets.lookAt);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setSize(width, height);
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 3. Studio Lighting Rig (Warm Key + Cool Fill + Rim + Grounding Shadow)
      const hemiLight = new THREE.HemisphereLight(0xe2e8f0, 0x1e293b, 0.9);
      hemiLight.position.set(0, 5, 0);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xffedd5, 1.4);
      keyLight.position.set(3, 4, 2.5);
      if (!isSoftwareGl) {
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 10;
        keyLight.shadow.camera.left = -2;
        keyLight.shadow.camera.right = 2;
        keyLight.shadow.camera.top = 2.5;
        keyLight.shadow.camera.bottom = -1;
        keyLight.shadow.bias = -0.0005;
        keyLight.shadow.normalBias = 0.02;
      }
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x84cc16, 0.85);
      rimLight.position.set(-3, 2.5, -2);
      scene.add(rimLight);

      // Studio Ground Floor with subtle grid
      const groundGeo = new THREE.PlaneGeometry(12, 12);
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.85,
        metalness: 0.1
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.01;
      ground.receiveShadow = true;
      scene.add(ground);

      const gridHelper = new THREE.GridHelper(8, 16, 0x1e293b, 0x0f172a);
      gridHelper.position.y = 0;
      scene.add(gridHelper);

      // Soft Radial Contact Shadow under Coach Milo
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 128;
      shadowCanvas.height = 128;
      const ctx = shadowCanvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
        grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
      }
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const contactShadowGeo = new THREE.PlaneGeometry(1.6, 1.6);
      const contactShadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
      });
      const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
      contactShadow.rotation.x = -Math.PI / 2;
      contactShadow.position.y = 0.002;
      scene.add(contactShadow);

      // 4. Instantiate Coach Milo Rig
      const rig = createCoachMiloRig();
      rigRef.current = rig;
      scene.add(rig.rootGroup);

      // 5. Responsive Resize Observer with adaptive FOV to ensure coach is fully visible
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth || 640;
        const h = container.clientHeight || 360;
        const aspect = w / h;
        camera.aspect = aspect;

        // Dynamic FOV to prevent horizontal cropping in portrait while preserving vertical framing
        if (aspect < 1.0) {
          // Portrait phone: calculate vertical FOV that preserves horizontal framing
          camera.fov = Math.min(68, Math.max(48, 2 * Math.atan(Math.tan((42 * Math.PI / 180) / 2) / Math.max(0.45, aspect)) * (180 / Math.PI)));
        } else if (aspect < 1.4) {
          camera.fov = 44;
        } else {
          camera.fov = 40;
        }

        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      // 6. Animation Loop with Kinematics Execution and Camera Damping
      let lastTime = performance.now();

      const tick = () => {
        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        // Calculate cycle progress (0 to 1) based on current speed
        const cycleDuration = (2800 / speedRef.current);
        const elapsed = (Date.now() - startTimeRef.current) % cycleDuration;
        const rawProgress = isPlayingRef.current ? elapsed / cycleDuration : 0.5;

        // Compute joint pose from kinematics engine
        const pose: JointPose = computeCoachJointPose(
          exerciseIdRef.current,
          rawProgress,
          isIntroRef.current
        );

        // Apply pose to 3D rig
        rig.applyPose(pose, showCuesRef.current);

        // Report progress & form tip to parent UI
        if (onCycleProgress) {
          onCycleProgress(rawProgress, pose.formTip);
        }

        // Camera Smooth Damping toward active view mode & exercise targets
        const targetView = getExerciseCameraTargets(exerciseIdRef.current, viewModeRef.current);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetView.pos.x, 4, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetView.pos.y, 4, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetView.pos.z, 4, delta);

        // Damp lookAt target
        currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetView.lookAt.x, 4, delta);
        currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetView.lookAt.y, 4, delta);
        currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetView.lookAt.z, 4, delta);
        camera.lookAt(currentLookAt.current);

        // Render frame
        renderer.render(scene, camera);

        frameIdRef.current = requestAnimationFrame(tick);
      };

      frameIdRef.current = requestAnimationFrame(tick);

      // Cleanup on unmount
      return () => {
        if (frameIdRef.current) {
          cancelAnimationFrame(frameIdRef.current);
        }
        resizeObserver.disconnect();
        rig.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }, []);

    return (
      <div className={`relative w-full h-full overflow-hidden select-none bg-slate-950 ${className}`}>
        <div ref={mountRef} className="w-full h-full min-h-[220px]" />
      </div>
    );
  }
);

CoachMilo3DView.displayName = 'CoachMilo3DView';

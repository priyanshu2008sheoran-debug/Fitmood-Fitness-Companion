// 3D Human-Like Cartoon Fitness Coach Character ("Coach Milo")
// Built as a hierarchical THREE.Group with realistic body proportions,
// defined joints, athletic apparel, and interactive props.

import * as THREE from 'three';
import { JointPose } from './coachKinematics';

export interface CoachMiloRig {
  rootGroup: THREE.Group;
  characterGroup: THREE.Group;

  // Joints hierarchy
  pelvis: THREE.Group;
  spine: THREE.Group;
  chest: THREE.Group;
  neck: THREE.Group;
  head: THREE.Group;

  leftShoulder: THREE.Group;
  leftElbow: THREE.Group;
  leftWrist: THREE.Group;

  rightShoulder: THREE.Group;
  rightElbow: THREE.Group;
  rightWrist: THREE.Group;

  leftHip: THREE.Group;
  leftKnee: THREE.Group;
  leftAnkle: THREE.Group;

  rightHip: THREE.Group;
  rightKnee: THREE.Group;
  rightAnkle: THREE.Group;

  // Visual cues & Props
  wallProp: THREE.Group;
  benchProp: THREE.Group;
  matProp: THREE.Group;
  pullUpBarProp: THREE.Group;
  motionArrow: THREE.Group;
  spineGuide: THREE.Line;

  // Muscle highlight materials
  muscleMaterials: {
    chest: THREE.MeshStandardMaterial;
    triceps: THREE.MeshStandardMaterial;
    shoulders: THREE.MeshStandardMaterial;
    core: THREE.MeshStandardMaterial;
    quads: THREE.MeshStandardMaterial;
    glutes: THREE.MeshStandardMaterial;
    calves: THREE.MeshStandardMaterial;
    back: THREE.MeshStandardMaterial;
  };

  // Update function to apply pose
  applyPose: (pose: JointPose, showCues?: boolean) => void;
  dispose: () => void;
}

export function createCoachMiloRig(): CoachMiloRig {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'CoachMilo_Root';

  const characterGroup = new THREE.Group();
  characterGroup.name = 'CoachMilo_Character';
  rootGroup.add(characterGroup);

  // -------------------------------------------------------------
  // Materials Library (PBR Studio Materials with rich physical finishes)
  // -------------------------------------------------------------
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5c39e,
    roughness: 0.65,
    metalness: 0.05
  });

  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: 0x84cc16, // Vibrant Lime athletic compression shirt
    roughness: 0.5,
    metalness: 0.1
  });

  const shirtAccentMaterial = new THREE.MeshStandardMaterial({
    color: 0x10b981, // Emerald ergonomic seam lines
    roughness: 0.45,
    metalness: 0.15
  });

  const shortsMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Slate-900 athletic shorts
    roughness: 0.7,
    metalness: 0.05
  });

  const shortsStripeMaterial = new THREE.MeshStandardMaterial({
    color: 0xa3e635,
    roughness: 0.4,
    metalness: 0.1
  });

  const shoeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8fafc, // Crisp white sneaker upper
    roughness: 0.35,
    metalness: 0.1
  });

  const soleMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.8,
    metalness: 0.05
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b2416, // Rich styled brown hair
    roughness: 0.85,
    metalness: 0.05
  });

  const headbandMaterial = new THREE.MeshStandardMaterial({
    color: 0x10b981, // Signature emerald headband
    roughness: 0.4,
    metalness: 0.2
  });

  const eyeWhiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const smileMaterial = new THREE.MeshBasicMaterial({ color: 0x451a03 });

  // Muscle Highlight Glow Materials
  const createMuscleMaterial = (baseColor: number) => {
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.3,
      metalness: 0.1,
      emissive: baseColor,
      emissiveIntensity: 0.0,
      transparent: true,
      opacity: 0.95
    });
  };

  const muscleMaterials = {
    chest: createMuscleMaterial(0x84cc16),
    triceps: createMuscleMaterial(0x38bdf8),
    shoulders: createMuscleMaterial(0xf59e0b),
    core: createMuscleMaterial(0xa3e635),
    quads: createMuscleMaterial(0x84cc16),
    glutes: createMuscleMaterial(0xf97316),
    calves: createMuscleMaterial(0x10b981),
    back: createMuscleMaterial(0x06b6d4)
  };

  // -------------------------------------------------------------
  // Anatomical Skeletal Hierarchy
  // -------------------------------------------------------------
  // Pelvis / Root Pivot
  const pelvis = new THREE.Group();
  pelvis.name = 'Pelvis';
  pelvis.position.set(0, 0.98, 0); // ~1m above floor
  characterGroup.add(pelvis);

  // Pelvis mesh (Shorts waistband)
  const pelvisGeo = new THREE.CylinderGeometry(0.18, 0.17, 0.16, 20);
  const pelvisMesh = new THREE.Mesh(pelvisGeo, shortsMaterial);
  pelvisMesh.castShadow = true;
  pelvis.add(pelvisMesh);

  // Spine & Abdomen
  const spine = new THREE.Group();
  spine.name = 'Spine';
  spine.position.set(0, 0.08, 0);
  pelvis.add(spine);

  const abdomenGeo = new THREE.CylinderGeometry(0.19, 0.18, 0.16, 20);
  const abdomenMesh = new THREE.Mesh(abdomenGeo, shirtMaterial);
  abdomenMesh.position.set(0, 0.08, 0);
  abdomenMesh.castShadow = true;
  spine.add(abdomenMesh);

  // Core Muscle highlight plate
  const corePlateGeo = new THREE.BoxGeometry(0.18, 0.14, 0.05);
  const corePlate = new THREE.Mesh(corePlateGeo, muscleMaterials.core);
  corePlate.position.set(0, 0.08, 0.17);
  spine.add(corePlate);

  // Chest & Upper Torso
  const chest = new THREE.Group();
  chest.name = 'Chest';
  chest.position.set(0, 0.16, 0);
  spine.add(chest);

  // Broad athletic chest geometry
  const chestGeo = new THREE.BoxGeometry(0.42, 0.26, 0.22);
  const chestMesh = new THREE.Mesh(chestGeo, shirtMaterial);
  chestMesh.position.set(0, 0.12, 0);
  chestMesh.castShadow = true;
  chest.add(chestMesh);

  // Ergonomic shirt accent stripe
  const seamGeo = new THREE.CylinderGeometry(0.22, 0.21, 0.03, 20);
  const seamMesh = new THREE.Mesh(seamGeo, shirtAccentMaterial);
  seamMesh.position.set(0, 0.18, 0);
  chest.add(seamMesh);

  // Chest Pectoral Plates (Active highlight during push-ups)
  const leftPecGeo = new THREE.BoxGeometry(0.16, 0.12, 0.04);
  const leftPec = new THREE.Mesh(leftPecGeo, muscleMaterials.chest);
  leftPec.position.set(-0.09, 0.12, 0.115);
  chest.add(leftPec);

  const rightPec = new THREE.Mesh(leftPecGeo, muscleMaterials.chest);
  rightPec.position.set(0.09, 0.12, 0.115);
  chest.add(rightPec);

  // Upper back muscles
  const backPlateGeo = new THREE.BoxGeometry(0.32, 0.16, 0.04);
  const backPlate = new THREE.Mesh(backPlateGeo, muscleMaterials.back);
  backPlate.position.set(0, 0.12, -0.115);
  chest.add(backPlate);

  // Neck
  const neck = new THREE.Group();
  neck.name = 'Neck';
  neck.position.set(0, 0.25, 0);
  chest.add(neck);

  const neckGeo = new THREE.CylinderGeometry(0.075, 0.085, 0.1, 16);
  const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
  neckMesh.position.set(0, 0.04, 0);
  neckMesh.castShadow = true;
  neck.add(neckMesh);

  // Head & Friendly Stylized Face
  const head = new THREE.Group();
  head.name = 'Head';
  head.position.set(0, 0.12, 0);
  neck.add(head);

  // Head shape (Rounded human skull)
  const headGeo = new THREE.SphereGeometry(0.14, 24, 24);
  headGeo.scale(1, 1.15, 1.05);
  const headMesh = new THREE.Mesh(headGeo, skinMaterial);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Athletic Brown Hair
  const hairGeo = new THREE.SphereGeometry(0.148, 20, 20);
  hairGeo.scale(1.02, 1.15, 1.05);
  const hairMesh = new THREE.Mesh(hairGeo, hairMaterial);
  hairMesh.position.set(0, 0.03, -0.015);
  head.add(hairMesh);

  // Signature FitMood Headband
  const headbandGeo = new THREE.TorusGeometry(0.142, 0.02, 12, 28);
  headbandGeo.scale(1, 1.15, 1.05);
  headbandGeo.rotateX(Math.PI / 2);
  const headbandMesh = new THREE.Mesh(headbandGeo, headbandMaterial);
  headbandMesh.position.set(0, 0.03, 0);
  head.add(headbandMesh);

  // Expressive Friendly Eyes
  const eyeWhiteGeo = new THREE.SphereGeometry(0.022, 12, 12);
  const leftEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMaterial);
  leftEyeWhite.position.set(-0.048, 0.01, 0.132);
  head.add(leftEyeWhite);

  const rightEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMaterial);
  rightEyeWhite.position.set(0.048, 0.01, 0.132);
  head.add(rightEyeWhite);

  const pupilGeo = new THREE.SphereGeometry(0.012, 10, 10);
  const leftPupil = new THREE.Mesh(pupilGeo, pupilMaterial);
  leftPupil.position.set(-0.048, 0.01, 0.148);
  head.add(leftPupil);

  const rightPupil = new THREE.Mesh(pupilGeo, pupilMaterial);
  rightPupil.position.set(0.048, 0.01, 0.148);
  head.add(rightPupil);

  // Friendly Smile Line
  const smileCurve = new THREE.EllipseCurve(0, 0, 0.045, 0.025, 0, Math.PI, false, 0);
  const smilePoints = smileCurve.getPoints(16).map((p) => new THREE.Vector3(p.x, -p.y, 0));
  const smileGeo = new THREE.BufferGeometry().setFromPoints(smilePoints);
  const smileLine = new THREE.Line(smileGeo, smileMaterial);
  smileLine.position.set(0, -0.05, 0.138);
  head.add(smileLine);

  // Ears
  const earGeo = new THREE.SphereGeometry(0.032, 10, 10);
  earGeo.scale(0.5, 1, 0.7);
  const leftEar = new THREE.Mesh(earGeo, skinMaterial);
  leftEar.position.set(-0.14, 0, 0);
  head.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, skinMaterial);
  rightEar.position.set(0.14, 0, 0);
  head.add(rightEar);

  // -------------------------------------------------------------
  // Left Arm Hierarchy (Shoulder -> Bicep -> Elbow -> Forearm -> Hand)
  // -------------------------------------------------------------
  const leftShoulder = new THREE.Group();
  leftShoulder.name = 'LeftShoulder';
  leftShoulder.position.set(-0.24, 0.21, 0);
  chest.add(leftShoulder);

  // Shoulder deltoid joint
  const shoulderJointGeo = new THREE.SphereGeometry(0.075, 16, 16);
  const leftShoulderMesh = new THREE.Mesh(shoulderJointGeo, shirtMaterial);
  leftShoulderMesh.castShadow = true;
  leftShoulder.add(leftShoulderMesh);

  // Upper Arm (Biceps / Triceps)
  const upperArmGeo = new THREE.CapsuleGeometry(0.065, 0.22, 12, 16);
  const leftUpperArmMesh = new THREE.Mesh(upperArmGeo, skinMaterial);
  leftUpperArmMesh.position.set(0, -0.14, 0);
  leftUpperArmMesh.castShadow = true;
  leftShoulder.add(leftUpperArmMesh);

  // Triceps Highlight on back of upper arm
  const tricepPlateGeo = new THREE.BoxGeometry(0.05, 0.16, 0.03);
  const leftTricepPlate = new THREE.Mesh(tricepPlateGeo, muscleMaterials.triceps);
  leftTricepPlate.position.set(0, -0.14, -0.06);
  leftShoulder.add(leftTricepPlate);

  // Left Elbow
  const leftElbow = new THREE.Group();
  leftElbow.name = 'LeftElbow';
  leftElbow.position.set(0, -0.27, 0);
  leftShoulder.add(leftElbow);

  const elbowJointGeo = new THREE.SphereGeometry(0.058, 14, 14);
  const leftElbowMesh = new THREE.Mesh(elbowJointGeo, skinMaterial);
  leftElbow.add(leftElbowMesh);

  // Forearm
  const forearmGeo = new THREE.CapsuleGeometry(0.055, 0.22, 12, 16);
  const leftForearmMesh = new THREE.Mesh(forearmGeo, skinMaterial);
  leftForearmMesh.position.set(0, -0.13, 0);
  leftForearmMesh.castShadow = true;
  leftElbow.add(leftForearmMesh);

  // Left Wrist & Sculpted Hand
  const leftWrist = new THREE.Group();
  leftWrist.name = 'LeftWrist';
  leftWrist.position.set(0, -0.25, 0);
  leftElbow.add(leftWrist);

  // Palm
  const palmGeo = new THREE.BoxGeometry(0.08, 0.085, 0.035);
  const leftPalmMesh = new THREE.Mesh(palmGeo, skinMaterial);
  leftPalmMesh.position.set(0, -0.045, 0);
  leftWrist.add(leftPalmMesh);

  // Fingers (flat for push-ups/planks)
  const fingersGeo = new THREE.BoxGeometry(0.075, 0.06, 0.025);
  const leftFingersMesh = new THREE.Mesh(fingersGeo, skinMaterial);
  leftFingersMesh.position.set(0, -0.10, 0);
  leftWrist.add(leftFingersMesh);

  // -------------------------------------------------------------
  // Right Arm Hierarchy (Symmetrical)
  // -------------------------------------------------------------
  const rightShoulder = new THREE.Group();
  rightShoulder.name = 'RightShoulder';
  rightShoulder.position.set(0.24, 0.21, 0);
  chest.add(rightShoulder);

  const rightShoulderMesh = new THREE.Mesh(shoulderJointGeo, shirtMaterial);
  rightShoulderMesh.castShadow = true;
  rightShoulder.add(rightShoulderMesh);

  const rightUpperArmMesh = new THREE.Mesh(upperArmGeo, skinMaterial);
  rightUpperArmMesh.position.set(0, -0.14, 0);
  rightUpperArmMesh.castShadow = true;
  rightShoulder.add(rightUpperArmMesh);

  const rightTricepPlate = new THREE.Mesh(tricepPlateGeo, muscleMaterials.triceps);
  rightTricepPlate.position.set(0, -0.14, -0.06);
  rightShoulder.add(rightTricepPlate);

  const rightElbow = new THREE.Group();
  rightElbow.name = 'RightElbow';
  rightElbow.position.set(0, -0.27, 0);
  rightShoulder.add(rightElbow);

  const rightElbowMesh = new THREE.Mesh(elbowJointGeo, skinMaterial);
  rightElbow.add(rightElbowMesh);

  const rightForearmMesh = new THREE.Mesh(forearmGeo, skinMaterial);
  rightForearmMesh.position.set(0, -0.13, 0);
  rightForearmMesh.castShadow = true;
  rightElbow.add(rightForearmMesh);

  const rightWrist = new THREE.Group();
  rightWrist.name = 'RightWrist';
  rightWrist.position.set(0, -0.25, 0);
  rightElbow.add(rightWrist);

  const rightPalmMesh = new THREE.Mesh(palmGeo, skinMaterial);
  rightPalmMesh.position.set(0, -0.045, 0);
  rightWrist.add(rightPalmMesh);

  const rightFingersMesh = new THREE.Mesh(fingersGeo, skinMaterial);
  rightFingersMesh.position.set(0, -0.10, 0);
  rightWrist.add(rightFingersMesh);

  // -------------------------------------------------------------
  // Left Leg Hierarchy (Hip -> Thigh -> Knee -> Calf -> Sneaker)
  // -------------------------------------------------------------
  const leftHip = new THREE.Group();
  leftHip.name = 'LeftHip';
  leftHip.position.set(-0.11, -0.08, 0);
  pelvis.add(leftHip);

  // Thigh & Shorts Leg
  const thighGeo = new THREE.CapsuleGeometry(0.085, 0.32, 14, 16);
  const leftThighMesh = new THREE.Mesh(thighGeo, skinMaterial);
  leftThighMesh.position.set(0, -0.21, 0);
  leftThighMesh.castShadow = true;
  leftHip.add(leftThighMesh);

  // Shorts leg cover
  const shortsLegGeo = new THREE.CylinderGeometry(0.105, 0.10, 0.22, 16);
  const leftShortsLeg = new THREE.Mesh(shortsLegGeo, shortsMaterial);
  leftShortsLeg.position.set(0, -0.11, 0);
  leftHip.add(leftShortsLeg);

  // Shorts accent stripe
  const stripeGeo = new THREE.BoxGeometry(0.02, 0.20, 0.205);
  const leftStripe = new THREE.Mesh(stripeGeo, shortsStripeMaterial);
  leftStripe.position.set(-0.10, -0.11, 0);
  leftHip.add(leftStripe);

  // Quadriceps Highlight Plate (Squats / Lunges)
  const quadPlateGeo = new THREE.BoxGeometry(0.09, 0.18, 0.035);
  const leftQuadPlate = new THREE.Mesh(quadPlateGeo, muscleMaterials.quads);
  leftQuadPlate.position.set(0, -0.22, 0.08);
  leftHip.add(leftQuadPlate);

  // Glute Highlight Plate
  const glutePlateGeo = new THREE.SphereGeometry(0.09, 12, 12);
  const leftGlutePlate = new THREE.Mesh(glutePlateGeo, muscleMaterials.glutes);
  leftGlutePlate.position.set(0, -0.05, -0.08);
  leftHip.add(leftGlutePlate);

  // Left Knee
  const leftKnee = new THREE.Group();
  leftKnee.name = 'LeftKnee';
  leftKnee.position.set(0, -0.42, 0);
  leftHip.add(leftKnee);

  const kneeJointGeo = new THREE.SphereGeometry(0.075, 14, 14);
  const leftKneeMesh = new THREE.Mesh(kneeJointGeo, skinMaterial);
  leftKnee.add(leftKneeMesh);

  // Calf & Lower Leg
  const calfGeo = new THREE.CapsuleGeometry(0.07, 0.34, 14, 16);
  const leftCalfMesh = new THREE.Mesh(calfGeo, skinMaterial);
  leftCalfMesh.position.set(0, -0.20, 0);
  leftCalfMesh.castShadow = true;
  leftKnee.add(leftCalfMesh);

  // Calf Muscle Highlight
  const calfPlateGeo = new THREE.BoxGeometry(0.07, 0.16, 0.03);
  const leftCalfPlate = new THREE.Mesh(calfPlateGeo, muscleMaterials.calves);
  leftCalfPlate.position.set(0, -0.16, -0.07);
  leftKnee.add(leftCalfPlate);

  // Left Ankle & Sneaker
  const leftAnkle = new THREE.Group();
  leftAnkle.name = 'LeftAnkle';
  leftAnkle.position.set(0, -0.40, 0);
  leftKnee.add(leftAnkle);

  // Athletic Sneaker Body
  const sneakerUpperGeo = new THREE.BoxGeometry(0.11, 0.09, 0.22);
  const leftSneakerUpper = new THREE.Mesh(sneakerUpperGeo, shoeMaterial);
  leftSneakerUpper.position.set(0, -0.02, 0.05);
  leftSneakerUpper.castShadow = true;
  leftAnkle.add(leftSneakerUpper);

  // Sneaker Rubber Sole
  const sneakerSoleGeo = new THREE.BoxGeometry(0.12, 0.035, 0.24);
  const leftSneakerSole = new THREE.Mesh(sneakerSoleGeo, soleMaterial);
  leftSneakerSole.position.set(0, -0.075, 0.05);
  leftAnkle.add(leftSneakerSole);

  // -------------------------------------------------------------
  // Right Leg Hierarchy (Symmetrical)
  // -------------------------------------------------------------
  const rightHip = new THREE.Group();
  rightHip.name = 'RightHip';
  rightHip.position.set(0.11, -0.08, 0);
  pelvis.add(rightHip);

  const rightThighMesh = new THREE.Mesh(thighGeo, skinMaterial);
  rightThighMesh.position.set(0, -0.21, 0);
  rightThighMesh.castShadow = true;
  rightHip.add(rightThighMesh);

  const rightShortsLeg = new THREE.Mesh(shortsLegGeo, shortsMaterial);
  rightShortsLeg.position.set(0, -0.11, 0);
  rightHip.add(rightShortsLeg);

  const rightStripe = new THREE.Mesh(stripeGeo, shortsStripeMaterial);
  rightStripe.position.set(0.10, -0.11, 0);
  rightHip.add(rightStripe);

  const rightQuadPlate = new THREE.Mesh(quadPlateGeo, muscleMaterials.quads);
  rightQuadPlate.position.set(0, -0.22, 0.08);
  rightHip.add(rightQuadPlate);

  const rightGlutePlate = new THREE.Mesh(glutePlateGeo, muscleMaterials.glutes);
  rightGlutePlate.position.set(0, -0.05, -0.08);
  rightHip.add(rightGlutePlate);

  const rightKnee = new THREE.Group();
  rightKnee.name = 'RightKnee';
  rightKnee.position.set(0, -0.42, 0);
  rightHip.add(rightKnee);

  const rightKneeMesh = new THREE.Mesh(kneeJointGeo, skinMaterial);
  rightKnee.add(rightKneeMesh);

  const rightCalfMesh = new THREE.Mesh(calfGeo, skinMaterial);
  rightCalfMesh.position.set(0, -0.20, 0);
  rightCalfMesh.castShadow = true;
  rightKnee.add(rightCalfMesh);

  const rightCalfPlate = new THREE.Mesh(calfPlateGeo, muscleMaterials.calves);
  rightCalfPlate.position.set(0, -0.16, -0.07);
  rightKnee.add(rightCalfPlate);

  const rightAnkle = new THREE.Group();
  rightAnkle.name = 'RightAnkle';
  rightAnkle.position.set(0, -0.40, 0);
  rightKnee.add(rightAnkle);

  const rightSneakerUpper = new THREE.Mesh(sneakerUpperGeo, shoeMaterial);
  rightSneakerUpper.position.set(0, -0.02, 0.05);
  rightSneakerUpper.castShadow = true;
  rightAnkle.add(rightSneakerUpper);

  const rightSneakerSole = new THREE.Mesh(sneakerSoleGeo, soleMaterial);
  rightSneakerSole.position.set(0, -0.075, 0.05);
  rightAnkle.add(rightSneakerSole);

  // -------------------------------------------------------------
  // Interactive 3D Studio Props
  // -------------------------------------------------------------

  // 1. Sleek 3D Studio Wall for Wall Push-Ups (located at z = 0.95)
  const wallProp = new THREE.Group();
  wallProp.name = 'WallProp';
  wallProp.position.set(0, 1.3, 0.95);

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // slate-700
    roughness: 0.6,
    metalness: 0.1
  });
  const wallTrimMat = new THREE.MeshStandardMaterial({
    color: 0x10b981, // emerald accent border
    roughness: 0.4,
    metalness: 0.3
  });

  const wallPanelGeo = new THREE.BoxGeometry(1.6, 2.2, 0.08);
  const wallPanel = new THREE.Mesh(wallPanelGeo, wallMat);
  wallPanel.receiveShadow = true;
  wallProp.add(wallPanel);

  // Wall hand alignment target markers
  const handTargetGeo = new THREE.RingGeometry(0.06, 0.08, 24);
  const handTargetMat = new THREE.MeshBasicMaterial({ color: 0x84cc16, side: THREE.DoubleSide });
  const leftHandTarget = new THREE.Mesh(handTargetGeo, handTargetMat);
  leftHandTarget.position.set(-0.24, 0.05, -0.045);
  wallProp.add(leftHandTarget);

  const rightHandTarget = new THREE.Mesh(handTargetGeo, handTargetMat);
  rightHandTarget.position.set(0.24, 0.05, -0.045);
  wallProp.add(rightHandTarget);

  rootGroup.add(wallProp);

  // 2. Sturdy Workout Bench / Step for Incline Push-Ups & Dips
  const benchProp = new THREE.Group();
  benchProp.name = 'BenchProp';
  benchProp.position.set(0, 0.32, 0.55);

  const benchTopGeo = new THREE.BoxGeometry(0.9, 0.08, 0.42);
  const benchPadMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.2
  });
  const benchTop = new THREE.Mesh(benchTopGeo, benchPadMat);
  benchTop.castShadow = true;
  benchTop.receiveShadow = true;
  benchProp.add(benchTop);

  const benchLegMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.3,
    metalness: 0.8
  });
  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.32, 12);
  [-0.38, 0.38].forEach((x) => {
    [-0.16, 0.16].forEach((z) => {
      const leg = new THREE.Mesh(legGeo, benchLegMat);
      leg.position.set(x, -0.16, z);
      leg.castShadow = true;
      benchProp.add(leg);
    });
  });
  rootGroup.add(benchProp);

  // 3. Premium Workout Mat on floor
  const matProp = new THREE.Group();
  matProp.name = 'MatProp';
  matProp.position.set(0, 0.005, 0);

  const matGeo = new THREE.BoxGeometry(1.1, 0.01, 2.2);
  const matMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // dark slate mat
    roughness: 0.75,
    metalness: 0.05
  });
  const matMesh = new THREE.Mesh(matGeo, matMat);
  matMesh.receiveShadow = true;
  matProp.add(matMesh);

  // Mat edge accent lines
  const matBorderGeo = new THREE.BoxGeometry(1.12, 0.012, 0.03);
  const matBorderMat = new THREE.MeshBasicMaterial({ color: 0x84cc16 });
  const matBorderTop = new THREE.Mesh(matBorderGeo, matBorderMat);
  matBorderTop.position.set(0, 0.001, 1.08);
  matProp.add(matBorderTop);

  const matBorderBottom = new THREE.Mesh(matBorderGeo, matBorderMat);
  matBorderBottom.position.set(0, 0.001, -1.08);
  matProp.add(matBorderBottom);

  rootGroup.add(matProp);

  // 4. Calisthenics Pull-Up Bar Structure
  const pullUpBarProp = new THREE.Group();
  pullUpBarProp.name = 'PullUpBarProp';
  pullUpBarProp.position.set(0, 2.15, 0);

  const barGeo = new THREE.CylinderGeometry(0.032, 0.032, 1.4, 16);
  barGeo.rotateZ(Math.PI / 2);
  const barMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.25,
    metalness: 0.85
  });
  const barMesh = new THREE.Mesh(barGeo, barMat);
  barMesh.castShadow = true;
  pullUpBarProp.add(barMesh);

  [-0.65, 0.65].forEach((x) => {
    const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 16);
    const postMesh = new THREE.Mesh(postGeo, benchLegMat);
    postMesh.position.set(x, -1.1, 0);
    pullUpBarProp.add(postMesh);
  });
  rootGroup.add(pullUpBarProp);

  // 5. 3D Directional Motion Indicator Arrow (Trajectory Visual Cue)
  const motionArrow = new THREE.Group();
  motionArrow.name = 'MotionArrow';
  motionArrow.position.set(0.65, 1.1, 0);

  const arrowConeGeo = new THREE.ConeGeometry(0.08, 0.16, 16);
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0xa3e635 });
  const arrowConeDown = new THREE.Mesh(arrowConeGeo, arrowMat);
  arrowConeDown.rotation.x = Math.PI;
  arrowConeDown.position.set(0, -0.15, 0);
  motionArrow.add(arrowConeDown);

  const arrowShaftGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.3, 12);
  const arrowShaft = new THREE.Mesh(arrowShaftGeo, arrowMat);
  motionArrow.add(arrowShaft);

  rootGroup.add(motionArrow);

  // 6. Spinal Alignment Posture Line
  const spinePoints = [
    new THREE.Vector3(0, 1.4, 0),
    new THREE.Vector3(0, 1.2, 0),
    new THREE.Vector3(0, 1.0, 0),
    new THREE.Vector3(0, 0.8, 0)
  ];
  const spineLineGeo = new THREE.BufferGeometry().setFromPoints(spinePoints);
  const spineLineMat = new THREE.LineDashedMaterial({
    color: 0x38bdf8,
    dashSize: 0.05,
    gapSize: 0.03,
    linewidth: 2
  });
  const spineGuide = new THREE.Line(spineLineGeo, spineLineMat);
  spineGuide.computeLineDistances();
  spineGuide.position.set(0, 0, 0.18);
  characterGroup.add(spineGuide);

  // -------------------------------------------------------------
  // applyPose method: smooth joint rotation & translation
  // -------------------------------------------------------------
  const applyPose = (pose: JointPose, showCues = true) => {
    // Root position & orientation
    characterGroup.position.set(
      pose.rootPosition[0],
      pose.rootPosition[1],
      pose.rootPosition[2]
    );
    characterGroup.rotation.set(
      pose.rootRotation[0],
      pose.rootRotation[1],
      pose.rootRotation[2]
    );

    // Spine & Chest
    spine.rotation.set(pose.spineRotation[0], pose.spineRotation[1], pose.spineRotation[2]);
    chest.rotation.set(pose.chestRotation[0], pose.chestRotation[1], pose.chestRotation[2]);
    head.rotation.set(pose.headRotation[0], pose.headRotation[1], pose.headRotation[2]);

    // Left Arm
    leftShoulder.rotation.set(
      pose.leftShoulderRotation[0],
      pose.leftShoulderRotation[1],
      pose.leftShoulderRotation[2]
    );
    leftElbow.rotation.x = pose.leftElbowRotation;
    leftWrist.rotation.set(
      pose.leftWristRotation[0],
      pose.leftWristRotation[1],
      pose.leftWristRotation[2]
    );

    // Right Arm
    rightShoulder.rotation.set(
      pose.rightShoulderRotation[0],
      pose.rightShoulderRotation[1],
      pose.rightShoulderRotation[2]
    );
    rightElbow.rotation.x = pose.rightElbowRotation;
    rightWrist.rotation.set(
      pose.rightWristRotation[0],
      pose.rightWristRotation[1],
      pose.rightWristRotation[2]
    );

    // Left Leg
    leftHip.rotation.set(pose.leftHipRotation[0], pose.leftHipRotation[1], pose.leftHipRotation[2]);
    leftKnee.rotation.x = pose.leftKneeRotation;
    leftAnkle.rotation.x = pose.leftAnkleRotation;

    // Right Leg
    rightHip.rotation.set(pose.rightHipRotation[0], pose.rightHipRotation[1], pose.rightHipRotation[2]);
    rightKnee.rotation.x = pose.rightKneeRotation;
    rightAnkle.rotation.x = pose.rightAnkleRotation;

    // Props visibility
    wallProp.visible = pose.showWall;
    benchProp.visible = pose.showBench;
    matProp.visible = pose.showMat;
    pullUpBarProp.visible = pose.showPullUpBar;

    // Motion Cue Arrow & Spine Guide
    motionArrow.visible = showCues && pose.cueIntensity > 0.05;
    spineGuide.visible = showCues;

    if (motionArrow.visible) {
      motionArrow.position.y = 1.0 + Math.sin(Date.now() * 0.004) * 0.12;
      arrowMat.color.setHex(pose.cueIntensity > 0.7 ? 0x84cc16 : 0x38bdf8);
    }

    // Active Muscle Highlights
    const activeSet = new Set(pose.activeMuscles);
    const glowIntensity = showCues ? (0.3 + pose.cueIntensity * 0.7) : 0;

    Object.keys(muscleMaterials).forEach((muscleKey) => {
      const mat = muscleMaterials[muscleKey as keyof typeof muscleMaterials];
      const isActive = activeSet.has(muscleKey as unknown as JointPose['activeMuscles'][0]);
      mat.emissiveIntensity = isActive ? glowIntensity : 0.0;
    });
  };

  const dispose = () => {
    // Dispose all geometries and materials to avoid memory leaks
    rootGroup.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      }
    });
  };

  return {
    rootGroup,
    characterGroup,
    pelvis,
    spine,
    chest,
    neck,
    head,
    leftShoulder,
    leftElbow,
    leftWrist,
    rightShoulder,
    rightElbow,
    rightWrist,
    leftHip,
    leftKnee,
    leftAnkle,
    rightHip,
    rightKnee,
    rightAnkle,
    wallProp,
    benchProp,
    matProp,
    pullUpBarProp,
    motionArrow,
    spineGuide,
    muscleMaterials,
    applyPose,
    dispose
  };
}

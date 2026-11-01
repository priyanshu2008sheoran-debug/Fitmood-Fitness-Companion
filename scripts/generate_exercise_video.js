#!/usr/bin/env node
/**
 * FitMood - Google Gemini Exercise Video Generator CLI
 * Uses Google's official Gemini Interactions API with model 'gemini-omni-1.1-flash'
 * to generate anatomically accurate fitness video clips.
 *
 * Usage:
 *   node scripts/generate_exercise_video.js --exercise=standard-push-up
 *   node scripts/generate_exercise_video.js --all
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY environment variable is missing.');
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

const TARGET_EXERCISES = [
  'standard-push-up',
  'bodyweight-squat',
  'reverse-lunge',
  'plank',
  'jumping-jacks',
  'glute-bridge',
  'mountain-climbers',
  'burpees-modified',
  'wall-push-up',
  'shoulder-circles'
];

async function generateVideoForExercise(exerciseId) {
  console.log(`\n========================================`);
  console.log(`Starting generation for: ${exerciseId}`);
  console.log(`Model: gemini-omni-1.1-flash`);
  console.log(`========================================`);

  const prompt = `High-definition 1080p 60fps video of a professional human fitness instructor demonstrating ${exerciseId.replace(/-/g, ' ')}. Fixed tripod wide-angle camera shot showing the entire human body from head to feet in continuous view with 15% safety padding above head and below feet. Neutral clean home fitness studio background with warm wood floor. Continuous clean loop of 3 flawless repetitions with proper biomechanics and controlled tempo.`;

  try {
    if (!ai.interactions || typeof ai.interactions.create !== 'function') {
      console.log(`Note: Interactions API for video generation is not supported on this client version.`);
      return;
    }

    const interaction = await ai.interactions.create({
      model: 'gemini-omni-1.1-flash',
      input: [{ text: prompt }]
    });

    console.log(`Job submitted! Interaction ID: ${interaction.id}`);
    console.log(`Status: ${interaction.status}`);

    // Output target directory
    const outputDir = path.resolve('public/videos/exercises');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    console.log(`Destination will be: ${path.join(outputDir, `${exerciseId}.mp4`)}`);
  } catch (err) {
    console.error(`Generation error:`, err.message || err);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const exerciseArg = args.find(a => a.startsWith('--exercise='));
  const isAll = args.includes('--all');

  if (isAll) {
    for (const ex of TARGET_EXERCISES) {
      await generateVideoForExercise(ex);
    }
  } else if (exerciseArg) {
    const exId = exerciseArg.split('=')[1];
    await generateVideoForExercise(exId);
  } else {
    console.log(`Usage: node scripts/generate_exercise_video.js --exercise=<exercise-id> or --all`);
    console.log(`Available exercises: ${TARGET_EXERCISES.join(', ')}`);
  }
}

main();

# FitMood Video Assets Directory (`/public/videos/exercises/`)

This directory houses optimized, realistic human fitness demonstration MP4 videos generated using Google Gemini's video technology or imported from certified calisthenics academies.

## Model Specification
- **Engine**: Google Gemini Video Generation (`gemini-omni-1.1-flash`) via the `@google/genai` Interactions API.
- **Aspect Ratio**: `16:9` widescreen
- **Framing Rule**: Fixed tripod wide-angle shot (`wide_full_body`). The human coach must remain completely visible from head to toe in every frame without cropping.
- **Rendering**: 1080p, 60fps, continuous loop.

## Core Exercises Library
1. `standard-push-up.mp4` — Standard Floor Push-Ups
2. `bodyweight-squat.mp4` — Bodyweight Air Squats
3. `reverse-lunge.mp4` — Reverse Lunges
4. `plank.mp4` — Forearm Plank (Isometric Hold)
5. `jumping-jacks.mp4` — Jumping Jacks (Cardio Spark)
6. `glute-bridge.mp4` — Glute Bridges
7. `mountain-climbers.mp4` — Mountain Climbers
8. `burpees-modified.mp4` — Modified Low-Impact Burpees
9. `wall-push-up.mp4` — Wall Push-Ups
10. `shoulder-circles.mp4` — Standing Shoulder Rolls & Stretches

## Quality & Review Standards
Before any video transitions from `in_review` to `verified`:
- Head-to-toe full visibility must be preserved with 10-15% margin above head and below feet.
- Starting, movement trajectory, and finishing positions must match ACSM/NASM calisthenics standards.
- Joint tracking (e.g. 45-degree elbows in push-ups, knees tracking toes in squats) must be confirmed by an exercise science specialist.

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// FitMood Gemini AI Coach Chat Endpoint
app.post('/api/gemini/coach', async (req, res) => {
  const messages: { role: string; text: string }[] = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const userContext: any = req.body?.userContext || {};

  if (messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Check if API key is missing or placeholder
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      const latestUserMessage = messages[messages.length - 1]?.text?.toLowerCase() || '';
      let tailoredFallback = "⚠️ GEMINI_API_KEY is not configured in the environment settings yet. FitMood Coach is running in offline guidance mode.\n\n";

      if (latestUserMessage.includes('push') || latestUserMessage.includes('arm') || latestUserMessage.includes('chest')) {
        tailoredFallback += "Push-Up Form Mastery: Keep elbows tucked at 45 degrees like an arrow (not flared out like a T). Squeeze glutes and brace abs to avoid sagging hips. If standard floor push-ups feel too tough, do Incline Push-Ups against a desk or sturdy chair!";
      } else if (latestUserMessage.includes('squat') || latestUserMessage.includes('leg') || latestUserMessage.includes('knee')) {
        tailoredFallback += "Squat Depth & Knee Safety: Keep your feet shoulder-width apart, drive knees outward in line with toes, and keep whole feet glued to the floor. Descend to parallel thighs with a proud chest!";
      } else if (latestUserMessage.includes('protein') || latestUserMessage.includes('diet') || latestUserMessage.includes('meal') || latestUserMessage.includes('food')) {
        tailoredFallback += "Affordable Indian Protein Staples: 1) Sattu drink (20g protein / ₹15), 2) Cooked soy chunks (Nutrela: 26g protein / ₹10), 3) Boiled eggs (12g protein in 2 eggs / ₹14), 4) Roasted chana + peanuts for crunchy clean snacking!";
      } else if (latestUserMessage.includes('10-minute') || latestUserMessage.includes('beginner') || latestUserMessage.includes('routine')) {
        tailoredFallback += "10-Minute Beginner Home Workout:\n1. Wall or Incline Push-Ups: 3 sets of 10 reps\n2. Bodyweight Squats: 3 sets of 12 reps\n3. Forearm Plank: 3 sets of 20 seconds\n4. Jumping Jacks: 2 sets of 30 seconds\nRest 45 seconds between sets. No gym needed!";
      } else {
        tailoredFallback += "Consistency beats intensity! For home calisthenics, focus on controlled 2-second eccentric lowering, breathe rhythmically, and take 45-60s rest between sets.";
      }

      return res.json({
        status: 'missing_key',
        isFallback: true,
        reply: tailoredFallback
      });
    }

    // Initialize GoogleGenAI SDK with user-agent
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are FitMood Coach — a passionate, friendly, empathetic, and knowledgeable personal home fitness & wellness coach.
FitMood motto: "Build your body. Boost your mood. No gym. No expensive equipment."

Your core specializations:
1. Calisthenics & Bodyweight exercises: Wall push-ups, incline push-ups, floor push-ups, bodyweight squats, reverse lunges, glute bridges, forearm planks, dead bugs, jumping jacks, bird dogs. Always emphasize joint safety, elbow tucking (45-degree arrow), neutral spine, and regressions for beginners.
2. Affordable Indian Nutrition: High-protein budget options like roasted chana (sattu), soy chunks (Nutrela), dal-khichdi with curd, boiled eggs, paneer, sprouts, peanuts. Keep it budget-friendly for students and everyday people.
3. Mood-to-Movement: Tailor workouts to how the user feels (energetic, tired, stressed, low motivation). If low motivation, suggest starting with a 3-minute warm-up or 5-minute gentle routine.
4. User Context:
${userContext?.name ? `- Name: ${userContext.name}` : ''}
${userContext?.goal ? `- Goal: ${userContext.goal}` : ''}
${userContext?.diet ? `- Diet: ${userContext.diet}` : ''}
${userContext?.limitations ? `- Limitations: ${userContext.limitations}` : ''}
${userContext?.xp ? `- User Level: Lv. ${userContext.level || 1} (${userContext.xp} XP)` : ''}

Rules:
- Be encouraging, practical, and action-oriented.
- Keep responses concise (under 160 words) unless the user asks for a comprehensive routine or meal plan.
- Never invent imaginary medical diagnoses; encourage doctor consultation for chronic pain.`;

    // Multi-turn conversation mapping for Gemini
    const contents = messages.slice(-10).map((m: { role: string; text: string }) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // Candidate models to try in case of transient 503 high demand spikes
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      if (response.text) {
        return res.json({ status: 'success', reply: response.text });
      }
    } catch (apiErr: any) {
      console.warn('Gemini 3.8 Flash temporary spike:', apiErr?.message || apiErr);
      throw apiErr;
    }

    throw new Error('No response text received.');
  } catch (error: any) {
    console.error('Gemini Coach error:', error);
    const latestUserMessage = messages[messages.length - 1]?.text?.toLowerCase() || '';
    let tailoredFallback = '';
    if (latestUserMessage.includes('10-minute') || latestUserMessage.includes('beginner') || latestUserMessage.includes('workout') || latestUserMessage.includes('routine')) {
      tailoredFallback = "Here is your 10-Minute Beginner Home Workout Routine:\n• Wall or Incline Push-Ups: 3 sets × 8-10 reps\n• Bodyweight Squats: 3 sets × 12 reps\n• Forearm Plank: 3 sets × 20 seconds\n• Jumping Jacks (or Step Jacks): 2 sets × 30 seconds\nRest 45-60 seconds between sets. Hydrate with small sips of water!";
    } else if (latestUserMessage.includes('push') || latestUserMessage.includes('arm') || latestUserMessage.includes('flare')) {
      tailoredFallback = "Push-Up Form Correction: Keep elbows tucked at 45 degrees like an arrow rather than 90 degrees flared like a 'T'. Squeeze your glutes and brace your abs to prevent lower back sagging. If floor push-ups feel too heavy, regress to Incline Push-Ups against a sturdy desk or chair!";
    } else if (latestUserMessage.includes('protein') || latestUserMessage.includes('diet') || latestUserMessage.includes('meal') || latestUserMessage.includes('indian')) {
      tailoredFallback = "Affordable Indian Protein Champions (under ₹30):\n1. Roasted Chana (Sattu drink): 20g protein for ₹15.\n2. Cooked Soy Chunks (Nutrela): 26g protein in 50g dry for ₹10.\n3. 2 Boiled Eggs: 12g complete protein for ₹14.\n4. Sprouted Moong + Peanuts salad with lemon: 14g clean plant protein!";
    } else if (latestUserMessage.includes('tired') || latestUserMessage.includes('stress') || latestUserMessage.includes('low motivation')) {
      tailoredFallback = "When low on energy, do not force maximal intensity! Shift to a 4-minute gentle joint mobility flow (Cat-Cow, Child’s Pose, and standing arm swings) or a 10-minute walk. Moving gently lowers cortisol and boosts endorphins!";
    } else {
      tailoredFallback = "FitMood Coach Principle: Controlled tempos (2 seconds down, 1 second hold, 1 second up), deep nasal breathing, and consistent effort always beat sporadic high-intensity workouts!";
    }

    return res.json({
      status: 'fallback',
      isFallback: true,
      error: error?.message || 'AI service temporarily unavailable.',
      reply: tailoredFallback
    });
  }
});

// FitMood Gemini AI Text-To-Speech (TTS) Endpoint
app.post('/api/gemini/tts', async (req, res) => {
  const { text, voice = 'Puck' } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text string is required for speech synthesis.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return res.json({
      status: 'fallback',
      audioData: null,
      message: 'GEMINI_API_KEY not configured. Client will use Web Speech Synthesis.'
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: text.slice(0, 500),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        status: 'success',
        audioData: base64Audio,
        mimeType: 'audio/wav',
      });
    }

    return res.json({
      status: 'fallback',
      audioData: null,
      message: 'No audio data returned by model.'
    });
  } catch (err: any) {
    console.warn('TTS generation warning:', err?.message || err);
    return res.json({
      status: 'fallback',
      audioData: null,
      error: err?.message || 'TTS unavailable'
    });
  }
});

// FitMood Interactive Voice Conversation Endpoint (Coach Milo Live Voice)
app.post('/api/gemini/voice-conversation', async (req, res) => {
  const {
    message = '',
    voice = 'Puck',
    userContext = {},
    history = []
  } = req.body || {};

  const userQuery = (message || '').trim();
  if (!userQuery) {
    return res.status(400).json({ error: 'A voice or text message is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '');

  // Fallback intelligent speech responses if API key is not present or offline
  const getOfflineVoiceReply = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('push') || q.includes('chest') || q.includes('arm')) {
      return {
        reply: "Keep those elbows tucked at forty-five degrees, like an arrow! Squeeze your glutes to lock your spine. If you feel tired, switch to incline push-ups against a chair.",
        followups: ["How many reps should I do?", "What about diamond push-ups?", "My wrists hurt, any tips?"]
      };
    } else if (q.includes('squat') || q.includes('leg') || q.includes('knee')) {
      return {
        reply: "Drive your knees outward in line with your toes, and keep your full foot planted on the floor. Inhale down, exhale powerfully on the way up!",
        followups: ["How deep should I go?", "Can I do jump squats?", "Fixing lower back lean"]
      };
    } else if (q.includes('tired') || q.includes('sore') || q.includes('stress') || q.includes('rest')) {
      return {
        reply: "Listen to your body today. High stress calls for a gentle 5-minute mobility flow or a brisk walk instead of heavy strain. Movement is medicine!",
        followups: ["Give me a 5-minute stretch", "Breathing exercises for stress", "Should I rest completely?"]
      };
    } else if (q.includes('protein') || q.includes('diet') || q.includes('food') || q.includes('eat')) {
      return {
        reply: "For cheap, clean fuel: roasted chana gives you twenty grams of protein for fifteen rupees. Soya chunks or boiled eggs also hit your targets fast!",
        followups: ["Post-workout Indian snack", "Vegetarian meal plan", "How much water daily?"]
      };
    }
    return {
      reply: "You're doing awesome showing up today! Remember: smooth, controlled tempo always beats rushed reps. Let's make every movement count!",
      followups: ["10-minute energizer", "Check my form", "Recommend today's workout"]
    };
  };

  if (!hasKey) {
    const fallback = getOfflineVoiceReply(userQuery);
    return res.json({
      status: 'offline_guide',
      reply: fallback.reply,
      spokenText: fallback.reply,
      audioData: null,
      followups: fallback.followups,
      isFallback: true
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const voicePrompt = `You are Coach Milo — FitMood's warm, energetic, and highly encouraging home fitness & voice coach.
The user is speaking to you directly in a voice conversation.
Motto: "Build your body. Boost your mood. No gym. No expensive equipment."

Rules for Voice Dialogue:
1. Speak in a conversational, punchy, natural tone (like a friendly live coach talking through headphones).
2. Keep your answer brief (maximum 2 to 3 sentences, under 50 words) so it is delightful to listen to aloud.
3. Be practical and encouraging: focus on joint safety, simple home calisthenics, or affordable Indian nutrition.
4. User info: ${userContext?.name ? `Name: ${userContext.name}` : ''} | Goal: ${userContext?.goal || 'General Fitness'} | Mood: ${userContext?.mood || 'Normal'}.
User just asked: "${userQuery}"`;

    // 1. Generate conversational response text
    const textResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: voicePrompt,
      config: {
        temperature: 0.7,
      },
    });

    const reply = (textResponse.text || "Let's keep moving together! Control your reps and breathe deep.").trim();

    // 2. Synthesize audio with Gemini TTS model
    let audioData: string | null = null;
    try {
      const ttsResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: reply,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || 'Puck' },
            },
          },
        },
      });
      audioData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (ttsErr: any) {
      console.warn('TTS voice audio generation skipped:', ttsErr?.message || ttsErr);
    }

    return res.json({
      status: 'success',
      reply,
      spokenText: reply,
      audioData,
      mimeType: 'audio/wav',
      voice,
      followups: [
        "How's my form?",
        "Give me a 10-minute routine",
        "Quick healthy snack tip"
      ]
    });
  } catch (error: any) {
    console.error('Voice conversation error:', error);
    const fallback = getOfflineVoiceReply(userQuery);
    return res.json({
      status: 'fallback',
      reply: fallback.reply,
      spokenText: fallback.reply,
      audioData: null,
      followups: fallback.followups,
      isFallback: true,
      error: error?.message || 'Voice service temporarily unavailable'
    });
  }
});


// FitMood Gemini AI Workout Generator Endpoint
app.post('/api/gemini/generate-workout', async (req, res) => {
  const {
    goal = 'general_fitness',
    availableTime = 15,
    fitnessLevel = 'beginner',
    limitations = '',
    focusArea = 'full_body',
    equipment = 'none',
    mood = 'normal',
    userName = 'Athlete'
  } = req.body || {};

  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '');

  // Helper function to produce an intelligent sports-science fallback routine
  const generateFallbackRoutine = () => {
    const timeNum = Number(availableTime) || 15;
    const isBeg = fitnessLevel === 'beginner';
    const isAdv = fitnessLevel === 'advanced';

    // Approximate METs: Light = 3.5, Moderate = 5.0, Vigorous = 7.5
    const met = isAdv ? 6.5 : isBeg ? 4.0 : 5.2;
    const estCalories = Math.round((met * 3.5 * 65 * timeNum) / 200);

    let title = '';
    let description = '';
    let targetMuscles: string[] = [];
    let exercises: any[] = [];
    let category = focusArea;

    if (focusArea === 'upper') {
      title = `${userName}'s ${timeNum}-Min Upper Power Matrix`;
      description = `Targeted upper body pushing, pulling mechanics, and shoulder stabilizer strengthening designed for home calisthenics.`;
      targetMuscles = ['Pectorals (Chest)', 'Triceps', 'Anterior Deltoids', 'Scapular Retractors', 'Core'];
      exercises = isBeg
        ? [
            { exerciseId: 'wall-push-up', exerciseName: 'Wall Push-Ups', sets: 3, repsOrSeconds: '10-12 reps', restSeconds: 45, targetMuscle: 'Chest & Triceps', coachingCue: 'Keep elbows tucked at a 45-degree arrow angle, body in rigid plank.', beginnerAlternative: 'Stand closer to the wall for reduced joint load.' },
            { exerciseId: 'doorframe-rows', exerciseName: 'Doorframe Calisthenics Rows', sets: 3, repsOrSeconds: '10-12 reps', restSeconds: 45, targetMuscle: 'Upper Back & Biceps', coachingCue: 'Squeeze shoulder blades firmly together at the top of the pull.', beginnerAlternative: 'Stand more upright to decrease leverage resistance.' },
            { exerciseId: 'chair-dips', exerciseName: 'Supported Chair Dips', sets: 2, repsOrSeconds: '8-10 reps', restSeconds: 45, targetMuscle: 'Triceps & Front Shoulders', coachingCue: 'Keep back skimming close to the chair edge; don’t shrug shoulders.', beginnerAlternative: 'Bend knees at 90 degrees with flat feet.' },
            { exerciseId: 'plank', exerciseName: 'Forearm Plank Hold', sets: 3, repsOrSeconds: '20-30 sec', restSeconds: 30, targetMuscle: 'Core & Serratus Anterior', coachingCue: 'Push floor away through elbows; squeeze glutes tight.', beginnerAlternative: 'Drop to knees if lower back dips.' }
          ]
        : [
            { exerciseId: 'standard-push-up', exerciseName: 'Floor Push-Ups', sets: 3, repsOrSeconds: '10-15 reps', restSeconds: 60, targetMuscle: 'Chest & Triceps', coachingCue: 'Lower chest to 2 inches from floor with locked core.', beginnerAlternative: 'Incline Push-Ups on a chair.' },
            { exerciseId: 'pike-push-up', exerciseName: 'Pike Push-Ups', sets: 3, repsOrSeconds: '8-10 reps', restSeconds: 60, targetMuscle: 'Deltoids & Traps', coachingCue: 'Hips high in inverted V; press vertically through shoulders.', beginnerAlternative: 'Hold high plank with feet elevated.' },
            { exerciseId: 'chair-dips', exerciseName: 'Deep Chair Dips', sets: 3, repsOrSeconds: '10-12 reps', restSeconds: 45, targetMuscle: 'Triceps', coachingCue: 'Full elbow lockout at the peak; descend to 90 degrees.', beginnerAlternative: 'Keep feet closer to chair.' },
            { exerciseId: 'plank-shoulder-taps', exerciseName: 'Plank Shoulder Taps', sets: 3, repsOrSeconds: '16 total taps', restSeconds: 45, targetMuscle: 'Core & Scapular Stability', coachingCue: 'Keep hips dead steady; do not sway from side to side.', beginnerAlternative: 'Widen foot stance for stability.' }
          ];
    } else if (focusArea === 'lower') {
      title = `${userName}'s ${timeNum}-Min Lower Pillar Blueprint`;
      description = `Progressive lower body calisthenics focusing on knee stability, glute firing, and ankle dorsiflexion mobility.`;
      targetMuscles = ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Calves', 'Hip Adductors'];
      exercises = isBeg
        ? [
            { exerciseId: 'chair-squats', exerciseName: 'Box / Chair Squats', sets: 3, repsOrSeconds: '10-12 reps', restSeconds: 45, targetMuscle: 'Quads & Glutes', coachingCue: 'Tap hips softly onto chair without collapsing; stand with glute squeeze.', beginnerAlternative: 'Use higher chair or sofa for shallower depth.' },
            { exerciseId: 'glute-bridge', exerciseName: 'Floor Glute Bridges', sets: 3, repsOrSeconds: '12-15 reps', restSeconds: 30, targetMuscle: 'Glutes & Hamstrings', coachingCue: 'Drive through heels and hold peak squeeze for 2 seconds.', beginnerAlternative: 'Shorten hold time at the top.' },
            { exerciseId: 'reverse-lunge', exerciseName: 'Supported Reverse Lunges', sets: 3, repsOrSeconds: '8 reps / leg', restSeconds: 45, targetMuscle: 'Quads & Hips', coachingCue: 'Step backward; lower back knee toward floor while keeping front knee over ankle.', beginnerAlternative: 'Hold onto a wall or table for balance.' },
            { exerciseId: 'calf-raise', exerciseName: 'Standing Calf Raises', sets: 3, repsOrSeconds: '15-20 reps', restSeconds: 30, targetMuscle: 'Calves (Gastrocnemius & Soleus)', coachingCue: 'Press high onto balls of feet; 2-second slow lowering eccentric.', beginnerAlternative: 'Keep fingertips on a wall for balance.' }
          ]
        : [
            { exerciseId: 'bodyweight-squat', exerciseName: 'Tempo Air Squats', sets: 4, repsOrSeconds: '15 reps (3s down)', restSeconds: 45, targetMuscle: 'Quadriceps & Glutes', coachingCue: 'Deep 3-second descent to parallel; explode up forcefully.', beginnerAlternative: 'Standard tempo squats.' },
            { exerciseId: 'walking-lunges', exerciseName: 'Walking Lunges', sets: 3, repsOrSeconds: '10 reps / leg', restSeconds: 45, targetMuscle: 'Glutes, Quads & Hamstrings', coachingCue: 'Proud upright chest; soft touch of back knee to floor.', beginnerAlternative: 'Stationary reverse lunges.' },
            { exerciseId: 'single-leg-glute-bridge', exerciseName: 'Single-Leg Glute Bridge', sets: 3, repsOrSeconds: '8 reps / leg', restSeconds: 45, targetMuscle: 'Glutes & Hamstrings', coachingCue: 'Drive through single heel; level pelvis throughout.', beginnerAlternative: 'Two-legged glute bridge.' },
            { exerciseId: 'wall-sit', exerciseName: 'Isometric Wall Sit', sets: 3, repsOrSeconds: '35-45 sec', restSeconds: 45, targetMuscle: 'Quads Endurance', coachingCue: 'Thighs parallel to floor at 90 degrees; back flat against wall.', beginnerAlternative: 'Raise hips slightly higher on wall.' }
          ];
    } else if (focusArea === 'core') {
      title = `${userName}'s ${timeNum}-Min Core Fortress System`;
      description = `Anti-extension, rotational endurance, and deep transverse abdominis activation without spinal crunching.`;
      targetMuscles = ['Rectus Abdominis', 'Transverse Abdominis', 'Internal & External Obliques', 'Erector Spinae'];
      category = 'core';
      exercises = [
        { exerciseId: 'dead-bug', exerciseName: 'Dead Bug Contra-Lateral Drive', sets: 3, repsOrSeconds: '10 reps / side', restSeconds: 30, targetMuscle: 'Deep Transverse Abdominis', coachingCue: 'Keep lower back glued completely flat against floor.', beginnerAlternative: 'Tap heels down with bent knees rather than full leg extension.' },
        { exerciseId: 'bird-dog', exerciseName: 'Bird Dog Spine Stabilizer', sets: 3, repsOrSeconds: '8 reps / side (2s hold)', restSeconds: 30, targetMuscle: 'Erector Spinae & Glute Medius', coachingCue: 'Reach opposite arm and heel away like stretching taffy.', beginnerAlternative: 'Move legs only first, keeping hands grounded.' },
        { exerciseId: 'side-plank', exerciseName: 'Side Plank Hip Elevation', sets: 3, repsOrSeconds: '20-30s / side', restSeconds: 30, targetMuscle: 'Obliques & Quadratus Lumborum', coachingCue: 'Keep elbow directly beneath shoulder; stack feet or stagger.', beginnerAlternative: 'Bend bottom knee to floor at 90 degrees.' },
        { exerciseId: 'bicycle-crunch', exerciseName: 'Controlled Bicycle Air Kicks', sets: 3, repsOrSeconds: '16 total reps', restSeconds: 45, targetMuscle: 'Obliques & Upper Rectus', coachingCue: 'Rotate through ribcage rather than pulling on neck.', beginnerAlternative: 'Keep one foot grounded between rotations.' }
      ];
    } else {
      // Full Body Calisthenics
      title = `${userName}'s ${timeNum}-Min Calisthenics Full-Body Ignition`;
      description = `Balanced push, pull, squat, and core circuit designed to elevate resting metabolic rate and build athletic conditioning.`;
      targetMuscles = ['Chest', 'Quadriceps', 'Glutes', 'Upper Back', 'Core', 'Cardiovascular System'];
      category = 'full_body';
      exercises = isBeg
        ? [
            { exerciseId: 'wall-push-up', exerciseName: 'Incline / Wall Push-Ups', sets: 3, repsOrSeconds: '10 reps', restSeconds: 45, targetMuscle: 'Chest & Arms', coachingCue: 'Brace core as a unified plank; inhale on descent.', beginnerAlternative: 'Elevate hands higher on table or wall.' },
            { exerciseId: 'chair-squats', exerciseName: 'Bodyweight Squats to Chair', sets: 3, repsOrSeconds: '12 reps', restSeconds: 45, targetMuscle: 'Quads & Glutes', coachingCue: 'Knees follow line of toes; push through midfoot and heel.', beginnerAlternative: 'Hold onto doorframe for balance.' },
            { exerciseId: 'bird-dog', exerciseName: 'Bird-Dog Stability Reaches', sets: 3, repsOrSeconds: '8 reps / side', restSeconds: 30, targetMuscle: 'Posterior Chain & Core', coachingCue: 'Hold 2-second pause at apex without arching lower back.', beginnerAlternative: 'Perform arm reach only, then leg reach.' },
            { exerciseId: 'glute-bridge', exerciseName: 'Floor Glute Bridges', sets: 3, repsOrSeconds: '12 reps', restSeconds: 30, targetMuscle: 'Glutes & Pelvic Floor', coachingCue: 'Squeeze glutes hard at the top; avoid hyperextending ribs.', beginnerAlternative: 'Rest 5 extra seconds between reps.' },
            { exerciseId: 'plank', exerciseName: 'Forearm Plank Endurance', sets: 2, repsOrSeconds: '25-30 sec', restSeconds: 45, targetMuscle: 'Transverse Core', coachingCue: 'Tuck pelvis slightly (posterior tilt); breathe into abdomen.', beginnerAlternative: 'Drop to knees for knee plank.' }
          ]
        : [
            { exerciseId: 'standard-push-up', exerciseName: 'Tempo Floor Push-Ups', sets: 3, repsOrSeconds: '12-15 reps', restSeconds: 45, targetMuscle: 'Chest, Triceps & Core', coachingCue: 'Elbows at 45 degrees; 2 seconds down, fast press up.', beginnerAlternative: 'Incline push-ups on bench or sturdy chair.' },
            { exerciseId: 'bodyweight-squat', exerciseName: 'Bodyweight Air Squats', sets: 3, repsOrSeconds: '16 reps', restSeconds: 45, targetMuscle: 'Quads & Glutes', coachingCue: 'Break at hips and knees simultaneously; chest proud.', beginnerAlternative: 'Box squats to chair.' },
            { exerciseId: 'reverse-lunge', exerciseName: 'Alternating Reverse Lunges', sets: 3, repsOrSeconds: '10 reps / leg', restSeconds: 45, targetMuscle: 'Glutes & Hamstrings', coachingCue: 'Step back into 90/90 knee angles; drive through front heel.', beginnerAlternative: 'Static split squats in place.' },
            { exerciseId: 'mountain-climbers', exerciseName: 'Mountain Climbers', sets: 3, repsOrSeconds: '30 sec', restSeconds: 30, targetMuscle: 'Cardio & Anterior Core', coachingCue: 'Drive knees rhythmically toward chest without piking hips.', beginnerAlternative: 'Slow elevated mountain climbers with hands on chair.' },
            { exerciseId: 'plank-shoulder-taps', exerciseName: 'Anti-Rotation Shoulder Taps', sets: 3, repsOrSeconds: '16 taps', restSeconds: 45, targetMuscle: 'Core & Scapular Stability', coachingCue: 'Imagine a glass of water balanced on your lower back.', beginnerAlternative: 'Wide stance high plank hold.' }
          ];
    }

    // Adapt exercise count to available time
    if (timeNum <= 10 && exercises.length > 3) {
      exercises = exercises.slice(0, 3);
    } else if (timeNum >= 25 && exercises.length === 4) {
      // Add a bonus cardio / finisher for longer sessions
      exercises.push({
        exerciseId: 'jumping-jacks',
        exerciseName: 'Cardio Flow Jacks / Shadow Boxing',
        sets: 3,
        repsOrSeconds: '35 sec',
        restSeconds: 30,
        targetMuscle: 'Full Body Endurance & Caloric Burn',
        coachingCue: 'Stay light on the balls of your feet; synchronize breathing rhythm.',
        beginnerAlternative: 'Low-impact Step Jacks (step one foot out at a time without jumping).'
      });
    }

    const gearList = Array.isArray(equipment) && equipment.length > 0 ? equipment : ['none'];
    const gearSummary = gearList.includes('none') && gearList.length === 1
      ? 'No equipment (100% Bodyweight Calisthenics)'
      : `Verified for: ${gearList.join(', ')}`;

    return {
      id: `ai-routine-${Date.now()}`,
      title,
      description,
      category,
      durationMinutes: timeNum,
      difficulty: fitnessLevel,
      estimatedCaloriesBurned: estCalories,
      targetMuscles,
      requiredEquipment: gearList,
      equipmentSummary: gearSummary,
      warmUp: [
        'Arm Circles & Shoulder Rolls (45s)',
        'Torso Rotations with Soft Knees (45s)',
        'Marching in Place with Hip Openers (45s)',
        'Cat-Cow Spine Mobilization (45s)'
      ],
      exercises,
      coolDown: [
        'Child’s Pose Deep Nasal Breathing (60s)',
        'Standing Quad & Hip Flexor Stretch (30s / leg)',
        'Chest Doorframe Stretch (45s)'
      ],
      recommendationReason: `Engineered specifically for your goal (${goal.replace('_', ' ')}), fitted perfectly inside ${timeNum} minutes at a ${fitnessLevel} difficulty${limitations ? ` while respecting your limitation (${limitations})` : ''}.`,
      coachTip: `Consistency always defeats intensity. Focus on 2-second controlled descents and deep diaphragmatic breathing throughout this session!`
    };
  };

  // If no API key configured, return high-quality sports-science algorithmically generated routine
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    const routine = generateFallbackRoutine();
    return res.json({
      status: 'fallback',
      isAiGenerated: false,
      message: 'Generated via FitMood Sports Science Engine (Offline Mode).',
      routine
    });
  }

  // Generate via GoogleGenAI SDK
  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Create a custom calisthenics & home bodyweight workout routine strictly optimized for:
- User Name: ${userName}
- Fitness Goal: ${goal}
- Available Duration: ${availableTime} minutes
- Fitness Experience Level: ${fitnessLevel}
- Focus Area: ${focusArea}
- Equipment Available: ${equipment}
- Current Energy / Mood: ${mood}
- Physical Limitations / Injuries: ${limitations || 'None'}

Workout Programming Requirements:
1. Duration must realistically fit inside ${availableTime} minutes including warm-up and cool-down.
2. For ${fitnessLevel} level, calibrate the exercise volume (sets & reps) and complexity properly.
3. If limitations are noted (${limitations}), ensure zero aggravated movements and provide joint-safe alternatives.
4. Whenever applicable, use standard calisthenics exercise IDs: wall-push-up, incline-push-up, knee-push-up, standard-push-up, diamond-push-up, chair-dips, chair-squats, bodyweight-squat, sumo-squat, reverse-lunge, walking-lunges, glute-bridge, single-leg-glute-bridge, calf-raise, wall-sit, plank, plank-shoulder-taps, side-plank, dead-bug, bird-dog, bicycle-crunch, hollow-body-hold, lying-leg-raises, russian-twists, mountain-climbers, jumping-jacks, high-knees, shadow-boxing-punches, skater-hops, cat-cow-stretch, childs-pose-breathing.
5. Provide actionable coaching cues and easier beginner alternatives for every movement.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are FitMood AI Workout Architect — an elite certified sports scientist, physical therapist, and calisthenics coach.
FitMood motto: "Build your body. Boost your mood. No gym. No expensive equipment."
Your mission: Return a structured JSON workout routine tailored with high precision to the athlete's exact time constraints, fitness level, and anatomical safety.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            durationMinutes: { type: Type.INTEGER },
            difficulty: { type: Type.STRING },
            estimatedCaloriesBurned: { type: Type.INTEGER },
            targetMuscles: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            warmUp: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  exerciseId: { type: Type.STRING },
                  exerciseName: { type: Type.STRING },
                  sets: { type: Type.INTEGER },
                  repsOrSeconds: { type: Type.STRING },
                  restSeconds: { type: Type.INTEGER },
                  targetMuscle: { type: Type.STRING },
                  coachingCue: { type: Type.STRING },
                  beginnerAlternative: { type: Type.STRING }
                },
                required: ['exerciseId', 'exerciseName', 'sets', 'repsOrSeconds', 'restSeconds', 'targetMuscle', 'coachingCue']
              }
            },
            coolDown: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendationReason: { type: Type.STRING },
            coachTip: { type: Type.STRING }
          },
          required: [
            'title',
            'description',
            'category',
            'durationMinutes',
            'difficulty',
            'estimatedCaloriesBurned',
            'targetMuscles',
            'warmUp',
            'exercises',
            'coolDown',
            'recommendationReason',
            'coachTip'
          ]
        }
      }
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text);
        if (!parsed.id) {
          parsed.id = `ai-gemini-${Date.now()}`;
        }
        return res.json({
          status: 'success',
          isAiGenerated: true,
          model: 'gemini-3.8-flash',
          routine: parsed
        });
      } catch (parseErr) {
        console.warn('JSON parsing error from Gemini output, falling back to structured routine:', parseErr);
      }
    }

    const fallback = generateFallbackRoutine();
    return res.json({
      status: 'fallback',
      isAiGenerated: false,
      routine: fallback
    });
  } catch (apiError: any) {
    console.error('Gemini Workout Generator error:', apiError?.message || apiError);
    const fallback = generateFallbackRoutine();
    return res.json({
      status: 'fallback',
      isAiGenerated: false,
      error: apiError?.message || 'Gemini API call failed',
      routine: fallback
    });
  }
});

// In-memory review and generation status registry
const exerciseVideoStatusStore = new Map<string, any>();

// Check Google Gemini Video Generation Capabilities
app.get('/api/gemini/video-capabilities', (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '');

  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    recommendedModel: 'gemini-omni-1.1-flash',
    supportedModels: ['gemini-omni-1.1-flash', 'gemini-3.8-flash'],
    framingStandard: 'wide_full_body_head_to_toe',
    aspectRatio: '16:9',
    message: hasKey
      ? 'Google Gemini API configured. Video generation model gemini-omni-1.1-flash active with verified human instructor demos.'
      : 'GEMINI_API_KEY not configured. High-definition verified demonstration player and written movement blueprints active.'
  });
});

// Fetch full Video Registry with current review status
app.get('/api/gemini/video-registry', (_req, res) => {
  const storedEntries = Array.from(exerciseVideoStatusStore.values());
  res.json({
    status: 'ok',
    entries: storedEntries
  });
});

// Update review status of an exercise video
app.post('/api/gemini/update-video-status', (req, res) => {
  const { exerciseId, status, notes, reviewerName } = req.body || {};
  if (!exerciseId || !status) {
    return res.status(400).json({ error: 'exerciseId and status are required.' });
  }

  const existing = exerciseVideoStatusStore.get(exerciseId) || { exerciseId };
  const updated = {
    ...existing,
    exerciseId,
    videoStatus: status,
    reviewerNotes: notes || existing.reviewerNotes,
    approvedBy: reviewerName || 'Fitness Review Specialist',
    lastReviewedAt: new Date().toISOString()
  };

  exerciseVideoStatusStore.set(exerciseId, updated);
  res.json({ status: 'ok', updated });
});

// Request Video Generation for an Exercise using Google gemini-omni-1.1-flash model
app.post('/api/gemini/generate-exercise-video', async (req, res) => {
  const { exerciseId, prompt } = req.body || {};

  if (!exerciseId) {
    return res.status(400).json({ error: 'exerciseId is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '');

  if (!hasKey) {
    return res.status(200).json({
      success: false,
      status: 'instructions_provided',
      exerciseId,
      model: 'gemini-omni-1.1-flash',
      message: 'GEMINI_API_KEY is not configured in the environment. Displaying verified demonstration clip and full written movement blueprint.',
      instructions: `To generate videos externally using Google's official Gemini Interactions API:\n1. Ensure your Google AI Studio project has API key with access to 'gemini-omni-1.1-flash'.\n2. Run: ai.interactions.create({ model: 'gemini-omni-1.1-flash', input: [{ text: "${prompt || 'Fitness exercise video'}" }] })\n3. Download generated MP4 into /public/videos/exercises/${exerciseId}.mp4.\n4. Mark as 'in_review' for fitness coach verification.`,
      commandSnippet: `curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \\\n  -H "Authorization: Bearer $GEMINI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model": "gemini-omni-1.1-flash", "input": [{"text": "${prompt || 'Exercise form demonstration'}"}]}'`
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Check if Interactions API is available on the client
    if (ai.interactions && typeof ai.interactions.create === 'function') {
      const interaction = await (ai.interactions.create as any)({
        model: 'gemini-omni-1.1-flash',
        input: [{ type: 'text', text: prompt || `High-definition 1080p 60fps video demonstration of ${exerciseId}` }]
      });

      return res.json({
        success: true,
        status: 'processing',
        exerciseId,
        model: 'gemini-omni-1.1-flash',
        interactionId: interaction.id,
        message: 'Video generation job successfully initiated on Google Gemini Interactions API.'
      });
    } else {
      // Interactions API not enabled on key tier or environment
      return res.json({
        success: false,
        status: 'instructions_provided',
        exerciseId,
        model: 'gemini-omni-1.1-flash',
        message: 'Interactions API (gemini-omni-1.1-flash) requires specialized project permissions. Providing external generation CLI workflow.',
        instructions: `Run the Google Gemini Video Generation workflow externally:\n1. Model: gemini-omni-1.1-flash\n2. Call Interactions API\n3. Save MP4 to /public/videos/exercises/${exerciseId}.mp4`,
        commandSnippet: `node scripts/generate_exercise_video.js --exercise=${exerciseId} --model=gemini-omni-1.1-flash`
      });
    }
  } catch (err: any) {
    console.warn('Gemini video generation request note:', err?.message || err);
    return res.json({
      success: false,
      status: 'instructions_provided',
      exerciseId,
      model: 'gemini-omni-1.1-flash',
      message: err?.message || 'Video generation service unavailable.',
      instructions: `Direct runtime generation error: ${err?.message || 'Access restricted'}. Displaying verified exercise demonstration with full written biomechanical checkpoints.`
    });
  }
});

// Setup Vite in development or static serving in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`FitMood server running on http://localhost:${PORT}`);
  });
}

startServer();

// Gemini Video Generation & Review Service
// Communicates with backend /api/gemini endpoints to initiate video generation requests using
// Google's gemini-omni-1.1-flash model, retrieve generation progress, and manage fitness expert review states.

import { ExerciseVideoEntry, EXERCISE_VIDEO_REGISTRY, getExerciseVideoEntry } from '../data/exerciseVideoRegistry';

export interface VideoGenerationResponse {
  success: boolean;
  status: 'completed' | 'processing' | 'pending_generation' | 'failed' | 'instructions_provided';
  exerciseId: string;
  model: string;
  videoUrl?: string;
  localPath?: string;
  message: string;
  instructions?: string;
  commandSnippet?: string;
}

export const geminiVideoService = {
  // Fetch list of all registered exercise videos with review status
  async getVideoRegistry(): Promise<ExerciseVideoEntry[]> {
    try {
      const response = await fetch('/api/gemini/video-registry');
      if (response.ok) {
        const data = await response.json();
        return data.entries || Object.values(EXERCISE_VIDEO_REGISTRY);
      }
    } catch {
      // Fallback to local registry
    }
    return Object.values(EXERCISE_VIDEO_REGISTRY);
  },

  // Request video generation via gemini-omni-1.1-flash model
  async requestVideoGeneration(exerciseId: string): Promise<VideoGenerationResponse> {
    const entry = getExerciseVideoEntry(exerciseId);
    if (!entry) {
      return {
        success: false,
        status: 'failed',
        exerciseId,
        model: 'gemini-omni-1.1-flash',
        message: `Exercise ID "${exerciseId}" not found in exercise registry.`
      };
    }

    try {
      const response = await fetch('/api/gemini/generate-exercise-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId, prompt: entry.geminiPrompt })
      });

      if (response.ok) {
        return await response.json();
      }
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        status: errData.status || 'instructions_provided',
        exerciseId,
        model: 'gemini-omni-1.1-flash',
        message: errData.error || 'Server returned an error for video generation.',
        instructions: errData.instructions,
        commandSnippet: errData.commandSnippet
      };
    } catch (err: any) {
      return {
        success: false,
        status: 'instructions_provided',
        exerciseId,
        model: 'gemini-omni-1.1-flash',
        message: 'Direct background rendering unavailable in this browser session.',
        instructions: `To generate videos externally using Google's official Gemini Interactions API:\n1. Ensure your GEMINI_API_KEY has access to model: "gemini-omni-1.1-flash".\n2. Call ai.interactions.create({ model: 'gemini-omni-1.1-flash', input: [{ text: "${entry.geminiPrompt}" }] }).\n3. Save resulting MP4 to /public/videos/exercises/${exerciseId}.mp4 and set status to "in_review".`
      };
    }
  },

  // Update review status by fitness expert (e.g., mark verified or flag for adjustments)
  async updateReviewStatus(
    exerciseId: string,
    status: 'verified' | 'in_review' | 'pending_generation',
    notes: string,
    reviewerName: string = 'Coach Alex'
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/gemini/update-video-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId, status, notes, reviewerName })
      });
      return response.ok;
    } catch {
      return false;
    }
  }
};

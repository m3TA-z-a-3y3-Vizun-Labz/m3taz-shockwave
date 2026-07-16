// Client-side playback helper for ElevenLabs TTS audio returned from main.
// Keeps a single active Audio element so speaking a new message stops the previous one.

let activeAudio: HTMLAudioElement | null = null;
let activeUrl: string | null = null;
let activeListeners: Set<(playing: boolean) => void> = new Set();

function notify(playing: boolean) {
  for (const cb of activeListeners) {
    try { cb(playing); } catch { /* ignore */ }
  }
}

function cleanup() {
  if (activeAudio) {
    try { activeAudio.pause(); } catch { /* ignore */ }
    activeAudio = null;
  }
  if (activeUrl) {
    try { URL.revokeObjectURL(activeUrl); } catch { /* ignore */ }
    activeUrl = null;
  }
  notify(false);
}

/** Subscribe to global play/stop state. Returns unsubscribe. */
export function onSpeakStateChange(cb: (playing: boolean) => void): () => void {
  activeListeners.add(cb);
  return () => { activeListeners.delete(cb); };
}

export function stopSpeaking() {
  cleanup();
}

export function isSpeaking(): boolean {
  return !!activeAudio && !activeAudio.paused;
}

/**
 * Synthesize + play text via main-process ElevenLabs. Returns error string or null on success.
 */
export async function speakText(text: string): Promise<string | null> {
  const plain = (text ?? '').trim();
  if (!plain) return 'Nothing to speak';

  stopSpeaking();

  const res = await window.api.tts.speak({ text: plain });
  if (res.error || !res.audioBase64) {
    return res.error || 'No audio returned';
  }

  const bytes = Uint8Array.from(atob(res.audioBase64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: res.mimeType || 'audio/mpeg' });
  activeUrl = URL.createObjectURL(blob);
  activeAudio = new Audio(activeUrl);
  notify(true);

  return new Promise((resolve) => {
    if (!activeAudio) {
      resolve('Playback failed');
      return;
    }
    activeAudio.onended = () => {
      cleanup();
      resolve(null);
    };
    activeAudio.onerror = () => {
      cleanup();
      resolve('Playback failed');
    };
    activeAudio.play().catch((err) => {
      cleanup();
      resolve(err?.message || 'Playback failed');
    });
  });
}

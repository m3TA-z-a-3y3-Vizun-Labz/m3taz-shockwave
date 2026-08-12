import React, { useCallback, useEffect, useState } from 'react';

const DEFAULT_VOICE = 'JBFqnCBsd6RMkjVDRZzb';
const DEFAULT_MODEL = 'eleven_multilingual_v2';

const MODEL_OPTIONS = [
  { id: 'eleven_multilingual_v2', label: 'Multilingual v2' },
  { id: 'eleven_turbo_v2_5', label: 'Turbo v2.5 (faster)' },
  { id: 'eleven_flash_v2_5', label: 'Flash v2.5 (lowest latency)' },
  { id: 'eleven_v3', label: 'Eleven v3' },
];

// Settings page for ElevenLabs text-to-speech:
//   1. Capture + store the API key (encrypted in main).
//   2. Pick voice + model.
//   3. Test button that speaks a short sample.
export default function TtsSection({ tts, onTtsChange }) {
  const apiKey = tts?.apiKey ?? '';
  const voiceId = tts?.voiceId || DEFAULT_VOICE;
  const modelId = tts?.modelId || DEFAULT_MODEL;
  const [showKey, setShowKey] = useState(false);
  const [voices, setVoices] = useState<Array<{ voiceId: string; name: string }>>([]);
  const [voicesError, setVoicesError] = useState<string | null>(null);
  const [voicesLoading, setVoicesLoading] = useState(false);
  const [testState, setTestState] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const [testError, setTestError] = useState<string | null>(null);

  const update = (patch) => onTtsChange?.({
    provider: 'elevenlabs',
    apiKey,
    voiceId,
    modelId,
    ...patch,
  });

  const loadVoices = useCallback(async () => {
    if (!apiKey) {
      setVoices([]);
      setVoicesError(null);
      return;
    }
    setVoicesLoading(true);
    setVoicesError(null);
    try {
      const res = await window.api.tts.listVoices();
      if (res.error) {
        setVoicesError(res.error);
        setVoices([]);
      } else {
        setVoices(res.voices ?? []);
      }
    } catch {
      setVoicesError('Failed to list voices');
      setVoices([]);
    } finally {
      setVoicesLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    const t = setTimeout(() => { loadVoices(); }, 400);
    return () => clearTimeout(t);
  }, [loadVoices]);

  const onTest = async () => {
    setTestError(null);
    setTestState('loading');
    try {
      const res = await window.api.tts.speak({
        text: 'The first move is what sets everything in motion.',
      });
      if (res.error || !res.audioBase64) {
        setTestError(res.error || 'No audio returned');
        setTestState('error');
        return;
      }
      const bytes = Uint8Array.from(atob(res.audioBase64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: res.mimeType || 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setTestState('playing');
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setTestState('idle');
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setTestError('Playback failed');
        setTestState('error');
      };
      await audio.play();
    } catch (err: any) {
      setTestError(err?.message || 'Test failed');
      setTestState('error');
    }
  };

  const testLabel = testState === 'loading'
    ? 'Synthesizing…'
    : testState === 'playing'
      ? 'Playing…'
      : 'Test voice';

  const voiceInList = voices.some((v) => v.voiceId === voiceId);

  return (
    <div className="settings-section">
      <h2 className="settings-section-title">Speech</h2>
      <p className="settings-section-desc">
        Read agent replies aloud with ElevenLabs text-to-speech. Get a key from{' '}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.api.openExternal('https://elevenlabs.io/app/settings/api-keys'); }}
        >elevenlabs.io</a>
        . The key is encrypted on this machine using your OS keychain. After
        saving, use the speaker button on assistant messages in chat.
      </p>

      <div className="settings-field">
        <label className="settings-field-label" htmlFor="tts-key">ElevenLabs API key</label>
        <div className="settings-input-row">
          <input
            id="tts-key"
            className="settings-input"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => update({ apiKey: e.target.value })}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
          />
          <button
            type="button"
            className="settings-input-toggle"
            onClick={() => setShowKey((v) => !v)}
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="settings-field">
        <label className="settings-field-label" htmlFor="tts-voice">Voice</label>
        {voices.length > 0 ? (
          <select
            id="tts-voice"
            className="settings-input"
            value={voiceId}
            onChange={(e) => update({ voiceId: e.target.value })}
          >
            {!voiceInList && (
              <option value={voiceId}>{voiceId} (saved)</option>
            )}
            {voices.map((v) => (
              <option key={v.voiceId} value={v.voiceId}>{v.name}</option>
            ))}
          </select>
        ) : (
          <input
            id="tts-voice"
            className="settings-input"
            type="text"
            value={voiceId}
            onChange={(e) => update({ voiceId: e.target.value.trim() })}
            placeholder={DEFAULT_VOICE}
            spellCheck={false}
            autoComplete="off"
          />
        )}
        {voicesLoading && (
          <p className="settings-field-hint">Loading voices…</p>
        )}
        {voicesError && (
          <p className="settings-field-hint" style={{ color: 'var(--fg-error)' }}>{voicesError}</p>
        )}
        {!apiKey && (
          <p className="settings-field-hint">Enter your API key to load the voice list.</p>
        )}
      </div>

      <div className="settings-field">
        <label className="settings-field-label" htmlFor="tts-model">Model</label>
        <select
          id="tts-model"
          className="settings-input"
          value={modelId}
          onChange={(e) => update({ modelId: e.target.value })}
        >
          {MODEL_OPTIONS.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
          {!MODEL_OPTIONS.some((m) => m.id === modelId) && (
            <option value={modelId}>{modelId}</option>
          )}
        </select>
      </div>

      <h3 className="settings-subsection-title" style={{ marginTop: 24 }}>Test</h3>
      <p className="settings-tab-intro">
        Speaks a short sample with your current voice and model.
      </p>
      <div className="transcription-test">
        <button
          type="button"
          className="settings-button"
          onClick={onTest}
          disabled={!apiKey || testState === 'loading' || testState === 'playing'}
        >
          {testLabel}
        </button>
        {!apiKey && (
          <p className="settings-field-hint">Enter your ElevenLabs key first.</p>
        )}
        {testError && (
          <p className="settings-field-hint" style={{ color: 'var(--fg-error)' }}>{testError}</p>
        )}
      </div>
    </div>
  );
}

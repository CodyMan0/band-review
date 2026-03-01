import { useCallback, useEffect, useRef, useState } from 'react';

export interface EQPreset {
  id: string;
  label: string;
  emoji: string;
  filters: { frequency: number; gain: number; type: BiquadFilterType; Q?: number }[];
}

export const EQ_PRESETS: EQPreset[] = [
  {
    id: 'flat',
    label: '원본',
    emoji: '⚖️',
    filters: [],
  },
  {
    id: 'guitar',
    label: '기타',
    emoji: '🎸',
    filters: [
      { frequency: 300, gain: 4, type: 'peaking', Q: 1 },
      { frequency: 1000, gain: 6, type: 'peaking', Q: 0.8 },
      { frequency: 3000, gain: 4, type: 'peaking', Q: 1 },
    ],
  },
  {
    id: 'drum',
    label: '드럼',
    emoji: '🥁',
    filters: [
      { frequency: 60, gain: 5, type: 'peaking', Q: 0.8 },
      { frequency: 150, gain: 4, type: 'peaking', Q: 1 },
      { frequency: 7000, gain: 5, type: 'peaking', Q: 1.2 },
    ],
  },
  {
    id: 'keyboard',
    label: '건반',
    emoji: '🎹',
    filters: [
      { frequency: 500, gain: 4, type: 'peaking', Q: 1 },
      { frequency: 1200, gain: 6, type: 'peaking', Q: 0.8 },
      { frequency: 2000, gain: 4, type: 'peaking', Q: 1 },
    ],
  },
  {
    id: 'bass',
    label: '베이스',
    emoji: '🎸',
    filters: [
      { frequency: 80, gain: 6, type: 'peaking', Q: 0.8 },
      { frequency: 150, gain: 5, type: 'peaking', Q: 1 },
      { frequency: 200, gain: 3, type: 'peaking', Q: 1.2 },
    ],
  },
  {
    id: 'vocal',
    label: '보컬',
    emoji: '🎤',
    filters: [
      { frequency: 2000, gain: 4, type: 'peaking', Q: 1 },
      { frequency: 2800, gain: 6, type: 'peaking', Q: 0.8 },
      { frequency: 3500, gain: 4, type: 'peaking', Q: 1 },
    ],
  },
];

const STORAGE_KEY = 'harmony-band-eq-preset';

function getSavedPresetId(): string {
  if (typeof window === 'undefined') return 'flat';
  return localStorage.getItem(STORAGE_KEY) ?? 'flat';
}

function savePresetId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, id);
}

export function useAudioEQ(audioElement: HTMLAudioElement | null) {
  const [activePresetId, setActivePresetId] = useState(getSavedPresetId);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const connectedElementRef = useRef<HTMLAudioElement | null>(null);

  // Initialize AudioContext and connect source once
  useEffect(() => {
    if (!audioElement) return;
    // Avoid reconnecting the same element (MediaElementSource can only be created once)
    if (connectedElementRef.current === audioElement) return;

    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audioElement);
    source.connect(ctx.destination);

    contextRef.current = ctx;
    sourceRef.current = source;
    connectedElementRef.current = audioElement;

    return () => {
      ctx.close();
      contextRef.current = null;
      sourceRef.current = null;
      connectedElementRef.current = null;
    };
  }, [audioElement]);

  // Apply EQ filters when preset changes
  useEffect(() => {
    const ctx = contextRef.current;
    const source = sourceRef.current;
    if (!ctx || !source) return;

    // Disconnect old filters
    source.disconnect();
    filtersRef.current.forEach((f) => f.disconnect());
    filtersRef.current = [];

    const preset = EQ_PRESETS.find((p) => p.id === activePresetId) ?? EQ_PRESETS[0];

    if (preset.filters.length === 0) {
      // Flat — direct connection
      source.connect(ctx.destination);
      return;
    }

    // Build filter chain
    const filters = preset.filters.map((f) => {
      const filter = ctx.createBiquadFilter();
      filter.type = f.type;
      filter.frequency.value = f.frequency;
      filter.gain.value = f.gain;
      if (f.Q !== undefined) filter.Q.value = f.Q;
      return filter;
    });

    // Chain: source → filter[0] → filter[1] → ... → destination
    source.connect(filters[0]);
    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }
    filters[filters.length - 1].connect(ctx.destination);

    filtersRef.current = filters;
  }, [activePresetId]);

  const setPreset = useCallback((presetId: string) => {
    setActivePresetId(presetId);
    savePresetId(presetId);
  }, []);

  return { activePresetId, setPreset };
}

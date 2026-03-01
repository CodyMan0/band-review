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
      // 기타 대역 강하게 부스트
      { frequency: 400, gain: 8, type: 'peaking', Q: 0.8 },
      { frequency: 1000, gain: 10, type: 'peaking', Q: 0.7 },
      { frequency: 3000, gain: 8, type: 'peaking', Q: 0.8 },
      // 다른 대역 컷
      { frequency: 80, gain: -6, type: 'peaking', Q: 0.8 },
      { frequency: 8000, gain: -4, type: 'peaking', Q: 1 },
    ],
  },
  {
    id: 'drum',
    label: '드럼',
    emoji: '🥁',
    filters: [
      // 킥/스네어 저역 부스트
      { frequency: 60, gain: 10, type: 'peaking', Q: 0.7 },
      { frequency: 200, gain: 6, type: 'peaking', Q: 0.8 },
      // 하이햇/심벌 고역 부스트
      { frequency: 5000, gain: 8, type: 'peaking', Q: 0.8 },
      { frequency: 10000, gain: 6, type: 'peaking', Q: 1 },
      // 중역 컷 (기타/건반/보컬 줄이기)
      { frequency: 1000, gain: -5, type: 'peaking', Q: 0.6 },
    ],
  },
  {
    id: 'keyboard',
    label: '건반',
    emoji: '🎹',
    filters: [
      // 건반 중역 부스트
      { frequency: 500, gain: 8, type: 'peaking', Q: 0.8 },
      { frequency: 1200, gain: 10, type: 'peaking', Q: 0.7 },
      { frequency: 2500, gain: 7, type: 'peaking', Q: 0.8 },
      // 저역/고역 컷
      { frequency: 80, gain: -6, type: 'peaking', Q: 0.8 },
      { frequency: 8000, gain: -4, type: 'peaking', Q: 1 },
    ],
  },
  {
    id: 'bass',
    label: '베이스',
    emoji: '🎸',
    filters: [
      // 베이스 저역 강하게 부스트
      { frequency: 60, gain: 10, type: 'peaking', Q: 0.7 },
      { frequency: 120, gain: 10, type: 'peaking', Q: 0.7 },
      { frequency: 250, gain: 6, type: 'peaking', Q: 0.8 },
      // 중고역 컷
      { frequency: 1000, gain: -5, type: 'peaking', Q: 0.6 },
      { frequency: 5000, gain: -8, type: 'peaking', Q: 0.8 },
    ],
  },
  {
    id: 'vocal',
    label: '보컬',
    emoji: '🎤',
    filters: [
      // 보컬 존재감 대역 부스트
      { frequency: 2000, gain: 8, type: 'peaking', Q: 0.8 },
      { frequency: 3000, gain: 10, type: 'peaking', Q: 0.7 },
      { frequency: 4000, gain: 6, type: 'peaking', Q: 0.8 },
      // 저역 컷 (베이스/킥 줄이기)
      { frequency: 100, gain: -8, type: 'peaking', Q: 0.7 },
      { frequency: 8000, gain: -4, type: 'peaking', Q: 1 },
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

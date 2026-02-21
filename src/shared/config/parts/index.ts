export type Part = 'vocal' | 'guitar' | 'bass' | 'drum' | 'keyboard' | 'etc';

export const PARTS: { value: Part; label: string; emoji: string; color: string; dot: string }[] = [
  {
    value: 'vocal',
    label: '보컬',
    emoji: '🎤',
    color: 'bg-rose-50 text-rose-600 border-rose-200',
    dot: 'bg-rose-400',
  },
  {
    value: 'guitar',
    label: '기타',
    emoji: '🎸',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    dot: 'bg-amber-400',
  },
  {
    value: 'bass',
    label: '베이스',
    emoji: '🎸',
    color: 'bg-teal-50 text-teal-600 border-teal-200',
    dot: 'bg-teal-400',
  },
  {
    value: 'drum',
    label: '드럼',
    emoji: '🥁',
    color: 'bg-orange-50 text-orange-600 border-orange-200',
    dot: 'bg-orange-400',
  },
  {
    value: 'keyboard',
    label: '건반',
    emoji: '🎹',
    color: 'bg-violet-50 text-violet-600 border-violet-200',
    dot: 'bg-violet-400',
  },
  {
    value: 'etc',
    label: '그 외',
    emoji: '🎵',
    color: 'bg-stone-50 text-stone-500 border-stone-200',
    dot: 'bg-stone-400',
  },
];

export function getPartConfig(part: Part) {
  return PARTS.find((p) => p.value === part) ?? PARTS[PARTS.length - 1];
}

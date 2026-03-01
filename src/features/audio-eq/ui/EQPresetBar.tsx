'use client';

import { EQ_PRESETS } from '@/shared/lib/audio-eq';

interface EQPresetBarProps {
  activePresetId: string;
  onPresetChange: (presetId: string) => void;
}

export function EQPresetBar({ activePresetId, onPresetChange }: EQPresetBarProps) {
  return (
    <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
      {EQ_PRESETS.map((preset) => {
        const isActive = preset.id === activePresetId;
        return (
          <button
            key={preset.id}
            onClick={() => onPresetChange(preset.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
              isActive
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {preset.emoji} {preset.label}
          </button>
        );
      })}
    </div>
  );
}

'use client';

import { useState } from 'react';

import { type Part, PARTS } from '@/shared/config/parts';
import { saveProfile, type UserProfile } from '@/shared/config/profile';
import { Input } from '@/shared/ui';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [part, setPart] = useState<Part>('vocal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const profile = { name: name.trim(), part };
    saveProfile(profile);
    onComplete(profile);
  };

  const selectedPart = PARTS.find((p) => p.value === part)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-5 rounded-2xl bg-card border border-border/60 shadow-2xl p-6"
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="text-2xl mb-1">👋</div>
          <h2 className="text-lg font-bold text-foreground">처음 오셨군요!</h2>
          <p className="text-sm text-muted-foreground">닉네임과 파트를 알려주시면 시작할 수 있어요</p>
        </div>

        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">닉네임</label>
          <Input
            placeholder="예: 김찬양"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="h-10 rounded-xl border-border/70 bg-background focus-visible:border-primary/50 focus-visible:ring-primary/20"
          />
        </div>

        {/* Part selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">파트</label>
          <div className="flex flex-wrap gap-2">
            {PARTS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPart(p.value)}
                className={`
                  inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium
                  transition-all duration-150 active:scale-95
                  ${part === p.value
                    ? `${p.color} shadow-sm scale-105`
                    : 'border-border/60 text-foreground/60 hover:border-border hover:text-foreground/80 bg-background'
                  }
                `}
              >
                <span>{p.emoji}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {name.trim() && (
          <div className="flex items-center gap-2 rounded-xl bg-muted/60 border border-border/40 px-3 py-2.5">
            <span className="text-xs text-muted-foreground">미리보기</span>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${selectedPart.color}`}>
              <span>{selectedPart.emoji}</span>
              <span>{name.trim()}</span>
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all duration-150 shadow-sm"
        >
          시작하기
        </button>
      </form>
    </div>
  );
}

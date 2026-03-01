'use client';

import { useEffect, useRef, useState } from 'react';
import { type Control, type UseFieldArrayReturn, type UseFormRegister } from 'react-hook-form';

import { searchSongs } from '@/entities/song';
import { getProfile } from '@/shared/config/profile';
import { Button, Input } from '@/shared/ui';

interface SongField {
  name: string;
  startTime: string;
}

interface FormValues {
  title: string;
  date: string;
  songs: SongField[];
}

/** Auto-format digits to MM:SS. Max 4 digits. e.g. "554" → "5:54", "1242" → "12:42" */
function autoFormatTime(raw: string): string {
  // Strip everything except digits
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits;
  const secPart = digits.slice(-2);
  const minPart = digits.slice(0, -2);
  return `${parseInt(minPart, 10)}:${secPart}`;
}

interface SongListInputProps {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  fieldArray: UseFieldArrayReturn<FormValues, 'songs', 'id'>;
  watchSongs: SongField[];
}

export function SongListInput({ register, fieldArray, watchSongs }: SongListInputProps) {
  const profile = getProfile();
  const churchId = profile?.churchId ?? '';

  const { fields, append, remove } = fieldArray;

  const [autocomplete, setAutocomplete] = useState<{ rowIndex: number; items: string[] } | null>(null);
  const debounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Close autocomplete on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAutocomplete(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleNameInput(index: number, value: string) {
    if (debounceTimers.current[index]) {
      clearTimeout(debounceTimers.current[index]);
    }

    if (!value.trim() || !churchId) {
      setAutocomplete(null);
      return;
    }

    debounceTimers.current[index] = setTimeout(async () => {
      const results = await searchSongs(value.trim(), churchId);
      const names = results.slice(0, 5).map((s) => s.name);
      if (names.length > 0) {
        setAutocomplete({ rowIndex: index, items: names });
      } else {
        setAutocomplete(null);
      }
    }, 300);
  }

  function handleAutocompleteSelect(index: number, selectedName: string) {
    // Programmatically set the field value via native input setter
    const input = containerRef.current?.querySelector<HTMLInputElement>(`input[name="songs.${index}.name"]`);
    if (input) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(input, selectedName);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    setAutocomplete(null);
  }

  // Per-row validation: highlight partial rows
  function getRowError(index: number): { name: boolean; time: boolean } {
    const song = watchSongs[index];
    if (!song) return { name: false, time: false };
    const hasName = !!song.name.trim();
    const hasTime = !!song.startTime.trim();
    return {
      name: !hasName && hasTime,
      time: hasName && !hasTime,
    };
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      {fields.map((field, index) => {
        const rowErr = getRowError(index);
        return (
          <div key={field.id} className="relative flex items-center gap-2">
            {/* Song name */}
            <div className="relative flex-1">
              <Input
                {...register(`songs.${index}.name`)}
                placeholder={`곡명 ${index + 1}`}
                className={`h-11 rounded-xl text-sm ${rowErr.name ? 'border-destructive ring-1 ring-destructive/30' : ''}`}
                autoComplete="off"
                onInput={(e) => handleNameInput(index, (e.target as HTMLInputElement).value)}
              />
              {autocomplete?.rowIndex === index && autocomplete.items.length > 0 && (
                <ul className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border bg-background shadow-lg">
                  {autocomplete.items.map((item) => (
                    <li
                      key={item}
                      className="cursor-pointer px-3 py-2 text-sm hover:bg-muted"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleAutocompleteSelect(index, item);
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Start time */}
            <Input
              {...register(`songs.${index}.startTime`, {
                onChange: (e) => {
                  e.target.value = autoFormatTime(e.target.value);
                },
              })}
              placeholder="0:00"
              inputMode="numeric"
              maxLength={5}
              className={`h-11 w-24 rounded-xl text-sm ${rowErr.time ? 'border-destructive ring-1 ring-destructive/30' : ''}`}
            />

            {/* Remove */}
            <button
              type="button"
              onClick={() => {
                if (fields.length <= 1) return;
                remove(index);
                setAutocomplete(null);
              }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="삭제"
            >
              ✕
            </button>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: '', startTime: '' })}
        className="h-11 w-full rounded-xl text-sm"
      >
        + 곡 추가
      </Button>
    </div>
  );
}

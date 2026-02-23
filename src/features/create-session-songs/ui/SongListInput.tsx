'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { searchSongs } from '@/entities/song';
import { getProfile } from '@/shared/config/profile';
import { Button, Input } from '@/shared/ui';

interface SongRow {
  name: string;
  startTime: string;
}

interface SongJson {
  name: string;
  startTimeSec: number;
}

function parseTimeToSeconds(time: string): number {
  const parts = time.split(':');
  if (parts.length !== 2) return 0;
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;
  return minutes * 60 + seconds;
}

function songsToJson(songs: SongRow[]): SongJson[] {
  return songs
    .filter((s) => s.name.trim())
    .map((s) => ({
      name: s.name.trim(),
      startTimeSec: parseTimeToSeconds(s.startTime),
    }));
}

export function SongListInput() {
  const profile = getProfile();
  const churchId = profile?.churchId ?? '';

  const [songs, setSongs] = useState<SongRow[]>([{ name: '', startTime: '' }]);
  const [autocomplete, setAutocomplete] = useState<{ rowIndex: number; items: string[] } | null>(
    null,
  );
  const debounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Update hidden input whenever songs change
  const getJsonValue = useCallback(() => {
    return JSON.stringify(songsToJson(songs));
  }, [songs]);

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

  function handleNameChange(index: number, value: string) {
    setSongs((prev) => prev.map((s, i) => (i === index ? { ...s, name: value } : s)));

    // Clear existing debounce
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

  function handleTimeChange(index: number, value: string) {
    setSongs((prev) => prev.map((s, i) => (i === index ? { ...s, startTime: value } : s)));
  }

  function handleAutocompleteSelect(index: number, name: string) {
    setSongs((prev) => prev.map((s, i) => (i === index ? { ...s, name } : s)));
    setAutocomplete(null);
  }

  function addRow() {
    setSongs((prev) => [...prev, { name: '', startTime: '' }]);
  }

  function removeRow(index: number) {
    setSongs((prev) => prev.filter((_, i) => i !== index));
    setAutocomplete(null);
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <input type="hidden" name="songs_json" value={getJsonValue()} />

      {songs.map((song, index) => (
        <div key={index} className="relative flex items-center gap-2">
          {/* Song name input with autocomplete */}
          <div className="relative flex-1">
            <Input
              value={song.name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder="곡명"
              className="h-11 rounded-xl text-sm"
              autoComplete="off"
              onFocus={() => {
                if (song.name.trim() && autocomplete?.rowIndex !== index) {
                  handleNameChange(index, song.name);
                }
              }}
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

          {/* Start time input */}
          <Input
            value={song.startTime}
            onChange={(e) => handleTimeChange(index, e.target.value)}
            placeholder="0:00"
            className="h-11 w-24 rounded-xl text-sm"
          />

          {/* Remove button */}
          <button
            type="button"
            onClick={() => removeRow(index)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="삭제"
          >
            ✕
          </button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addRow}
        className="h-11 w-full rounded-xl text-sm"
      >
        + 곡 추가
      </Button>
    </div>
  );
}

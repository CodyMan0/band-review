export interface Song {
  id: string;
  name: string;
  church_id: string;
  created_at: string;
}

export interface SessionSong {
  id: string;
  session_id: string;
  song_id: string;
  start_time_sec: number;
  song_order: number;
}

export interface SongWithSessionCount extends Song {
  session_count: number;
}

export interface SessionSongWithName extends SessionSong {
  song_name: string;
}

// For song detail page - session that played this song
export interface SongSessionInfo {
  session_id: string;
  session_title: string;
  session_date: string;
  start_time_sec: number;
}

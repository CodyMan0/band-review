let ffmpegInstance: Awaited<ReturnType<typeof loadFFmpeg>> | null = null;

async function loadFFmpeg() {
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  const { toBlobURL } = await import('@ffmpeg/util');

  const ffmpeg = new FFmpeg();

  // Use single-thread UMD build — no COOP/COEP headers needed (YouTube iframe compatible)
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
}

async function getFFmpeg() {
  if (!ffmpegInstance) {
    ffmpegInstance = await loadFFmpeg();
  }
  return ffmpegInstance;
}

export async function convertToAac(
  file: File,
  onProgress?: (ratio: number) => void,
): Promise<Blob> {
  const ffmpeg = await getFFmpeg();
  const { fetchFile } = await import('@ffmpeg/util');

  const progressHandler = onProgress
    ? ({ progress }: { progress: number }) => onProgress(progress)
    : null;

  if (progressHandler) {
    ffmpeg.on('progress', progressHandler);
  }

  const inputName = 'input' + getExtension(file.name);
  const outputName = 'output.m4a';

  await ffmpeg.writeFile(inputName, await fetchFile(file));
  await ffmpeg.exec(['-i', inputName, '-c:a', 'aac', '-b:a', '192k', '-y', outputName]);

  const data = await ffmpeg.readFile(outputName);

  // Cleanup
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  if (progressHandler) {
    ffmpeg.off('progress', progressHandler);
  }

  return new Blob([data], { type: 'audio/mp4' });
}

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  return idx >= 0 ? filename.slice(idx) : '.wav';
}

/** Check if a file needs conversion (non-AAC/M4A formats) */
export function needsConversion(file: File): boolean {
  const ext = getExtension(file.name).toLowerCase();
  return !['.m4a', '.aac', '.mp4'].includes(ext);
}

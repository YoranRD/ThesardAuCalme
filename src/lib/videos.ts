export const chapterTimePattern = /^\d{2}:\d{2}$/;

export const parseChapterTimeToSeconds = (time: string): number => {
  if (!chapterTimePattern.test(time)) {
    throw new Error(`Invalid chapter time format: ${time}`);
  }

  const [minutesText, secondsText] = time.split(":");
  const minutes = Number(minutesText);
  const seconds = Number(secondsText);

  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    throw new Error(`Chapter time contains non-numeric value: ${time}`);
  }

  if (seconds >= 60) {
    throw new Error(`Chapter seconds must be lower than 60: ${time}`);
  }

  return minutes * 60 + seconds;
};

export const formatSecondsToChapterTime = (secondsTotal: number): string => {
  const safeSeconds = Math.max(0, Math.floor(secondsTotal));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

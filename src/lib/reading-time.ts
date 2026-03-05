const DEFAULT_WORDS_PER_MINUTE = 200;
const MIN_REASONABLE_WPM = 80;
const MAX_REASONABLE_WPM = 400;

const markdownNoisePatterns = [
  /```[\s\S]*?```/g,
  /`[^`]*`/g,
  /!\[[^\]]*\]\([^)]*\)/g,
  /\[([^\]]+)\]\([^)]*\)/g,
  /<[^>]*>/g,
  /[#>*_~\-|]/g,
  /\s+/g
] as const;

const sanitizeMarkdownForWordCount = (markdown: string): string => {
  let cleaned = markdown;

  for (const pattern of markdownNoisePatterns) {
    cleaned = cleaned.replace(pattern, " ");
  }

  return cleaned.trim();
};

const countWords = (text: string): number => {
  const matches = text.match(/[\p{L}\p{N}]+(?:[\p{L}\p{N}'’-]+)*/gu);
  return matches ? matches.length : 0;
};

export const estimateReadingTimeMinutes = (
  markdown: string,
  wordsPerMinute: number = DEFAULT_WORDS_PER_MINUTE
): number => {
  const safeWpm =
    Number.isFinite(wordsPerMinute) && wordsPerMinute >= MIN_REASONABLE_WPM && wordsPerMinute <= MAX_REASONABLE_WPM
      ? wordsPerMinute
      : DEFAULT_WORDS_PER_MINUTE;

  const normalizedMarkdown = typeof markdown === "string" ? markdown : "";
  const sanitizedText = sanitizeMarkdownForWordCount(normalizedMarkdown);
  const words = countWords(sanitizedText);

  if (!Number.isFinite(words) || words <= 0) {
    return 1;
  }

  const minutes = Math.ceil(words / safeWpm);
  if (!Number.isFinite(minutes) || minutes < 1) {
    return 1;
  }

  return minutes;
};

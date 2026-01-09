/**
 * Estimates reading time for text content
 * @param content - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Estimated reading time in minutes
 */
const estimateReadTime = (
  content: string,
  wordsPerMinute: number = 200
): number => {
  const wordCount = content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export default estimateReadTime;

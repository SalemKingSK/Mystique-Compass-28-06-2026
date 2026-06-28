/**
 * AI wrapper — calls the Express /api/ai/transition-advisory endpoint
 * which holds the GEMINI_API_KEY server-side.
 */
export async function generateTransitionAdvisoryAI(prompt: string): Promise<string> {
  const res = await fetch('/api/ai/transition-advisory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error || 'AI request failed');
  }

  const data = await res.json();
  return data.text;
}

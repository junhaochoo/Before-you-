/**
 * Loose JSON parsing for LLM output (pure — unit-tested separately from llm.ts,
 * which carries `server-only`). Some models (e.g. Ollama gemma3) wrap JSON in
 * ```json fences or add surrounding prose despite a JSON-mode request.
 */
export function parseJsonLoose(content: string): unknown {
  const trimmed = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  try {
    return JSON.parse(trimmed);
  } catch {
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first >= 0 && last > first)
      return JSON.parse(trimmed.slice(first, last + 1));
    throw new Error("model did not return valid JSON");
  }
}

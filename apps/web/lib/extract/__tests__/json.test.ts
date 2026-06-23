/**
 * parseJsonLoose — tolerates the markdown-fenced / prose-wrapped JSON that some
 * models (Ollama gemma3) emit despite a JSON-mode request.
 */
import { describe, it, expect } from "vitest";
import { parseJsonLoose } from "../json";

describe("parseJsonLoose", () => {
  it("parses plain JSON", () => {
    expect(parseJsonLoose('{"a":1}')).toEqual({ a: 1 });
  });

  it("strips ```json fences", () => {
    const fenced =
      '```json\n{"ter_pct":{"value":1.5,"confidence":"high"}}\n```';
    expect(parseJsonLoose(fenced)).toEqual({
      ter_pct: { value: 1.5, confidence: "high" },
    });
  });

  it("strips bare ``` fences", () => {
    expect(parseJsonLoose('```\n{"a":2}\n```')).toEqual({ a: 2 });
  });

  it("extracts an object embedded in surrounding prose", () => {
    expect(parseJsonLoose('Here you go: {"a":3} hope that helps')).toEqual({
      a: 3,
    });
  });

  it("throws when there is no JSON object at all", () => {
    expect(() => parseJsonLoose("sorry, I cannot help")).toThrow();
  });
});

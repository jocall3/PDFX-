// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.


// mocks/MockAI.ts
// A deterministic, rule-based "AI" interpreter. Replaceable by an on-device LLM later.

export type Effect =
  | { op: 'log'; message: string }
  | { op: 'addWatermark'; page: number; text: string }
  | { op: 'highlightText'; text: string }
  | { op: 'lockPages'; pages: number[]; priceCents?: number }
  | { op: 'mintNFT'; metadata: Record<string, any> }
  | { op: 'runPayment'; priceCents: number; reason?: string };

export type AIResponse = {
  success: boolean;
  effects: Effect[];
  explanation?: string;
};

export class MockAI {
  // Interpret script text and return a plan of effects.
  static interpretScript(scriptText: string): AIResponse {
    // Heuristics: look for keywords to create meaningful effects.
    const effects: Effect[] = [];
    const s = scriptText.toLowerCase();

    if (s.includes('watermark')) {
      const match = s.match(/watermark(?:.*page\s+(\d+))?(?:.*text\s*["'](.*?)["'])?/i);
      const page = match && match[1] ? Number(match[1]) : 1;
      const text = match && match[2] ? match[2] : 'CONFIDENTIAL';
      effects.push({ op: 'addWatermark', page, text });
      effects.push({ op: 'log', message: `Planned watermark on page ${page} with text: "${text}"`});
    }

    if (s.includes('pay') || s.includes('unlock')) {
      const priceMatch = s.match(/\$?(\d+(\.\d+)?)/);
      const priceCents = priceMatch ? Math.round(Number(priceMatch[1]) * 100) : 500;
      effects.push({ op: 'lockPages', pages: [2,3], priceCents });
      effects.push({ op: 'log', message: `Will lock pages [2,3] for ${priceCents} cents.`});
    }

    if (s.includes('mint nft') || s.includes('mint')) {
      effects.push({ op: 'mintNFT', metadata: { title: 'Document Edition', timestamp: Date.now() }});
      effects.push({ op: 'log', message: 'Will mint NFT for current doc version.' });
    }

    if (effects.length === 0) {
      // fallback: echo-as-log and attempt to "highlight" text terms
      const tokens = scriptText.match(/\w+/g) || [];
      const maybeWord = tokens.length > 0 ? tokens[Math.floor(tokens.length/2)] : 'example';
      effects.push({ op: 'log', message: 'No direct heuristic match — defaulting to highlight.' });
      effects.push({ op: 'highlightText', text: maybeWord });
    }

    return { success: true, effects, explanation: 'Interpreted by MockAI heuristics.' };
  }

  // Debugging assistant: "fix" code by returning recommended change (mock)
  static debugScript(scriptText: string, errorMessage?: string) {
    const suggestion = scriptText + `\n\n// AI Suggestion: The error "${errorMessage}" might be due to an unhandled null value. Consider adding checks before accessing properties. (Mocked Response)`;
    return { suggestion, explanation: `MockAI suggests adding safe wrappers and validating inputs for the error: ${errorMessage}` };
  }
}

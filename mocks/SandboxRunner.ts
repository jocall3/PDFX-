// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

// mocks/SandboxRunner.ts
// Accepts script text -> asks MockAI for an effect plan -> executes effects by calling handler callbacks.

import { MockAI, Effect } from './MockAI';
import { MockPayment } from './MockPayment';
import { MockChain } from './MockChain';

export type EffectHandlers = {
  onLog?: (msg: string) => void;
  onWatermark?: (page: number, text: string) => void;
  onHighlight?: (text: string) => void;
  onLockPages?: (pages: number[], priceCents?: number) => void;
  onMintNFT?: (metadata: any) => void;
};

export async function runScriptInMockSandbox(scriptText: string, handlers: EffectHandlers) {
  // 1) interpret via AI
  const aiResp = MockAI.interpretScript(scriptText);
  // FIX: Corrected typo from `aiResponse` to `aiResp` to match the variable declared on the line above.
  handlers.onLog?.(`[MockAI] ${aiResp.explanation}`);

  for (const e of aiResp.effects) {
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 150));
    switch (e.op) {
      case 'log':
        handlers.onLog?.(e.message);
        MockChain.push('log', { message: e.message });
        break;
      case 'addWatermark':
        handlers.onWatermark?.(e.page, e.text);
        MockChain.push('watermark', { page: e.page, text: e.text });
        break;
      case 'highlightText':
        handlers.onHighlight?.(e.text);
        MockChain.push('highlight', { text: e.text });
        break;
      case 'lockPages':
        handlers.onLockPages?.(e.pages, e.priceCents);
        // create a mock payment session for the lock
        const session = MockPayment.createSession(e.priceCents ?? 500, 'usd', { reason: 'lockPages', pages: e.pages });
        MockChain.push('payment_session_created', session);
        handlers.onLog?.(`Created mock payment session ${session.id} for unlocking pages.`);
        break;
      case 'mintNFT':
        handlers.onMintNFT?.(e.metadata);
        MockChain.push('mint', e.metadata);
        break;
      case 'runPayment':
        const s = MockPayment.createSession(e.priceCents, 'usd', { reason: e.reason });
        MockChain.push('payment_session_created', s);
        handlers.onLog?.(`Mock payment created ${s.id}`);
        break;
      default:
        handlers.onLog?.(`Unknown effect: ${(e as any).op}`);
    }
  }
  return aiResp;
}
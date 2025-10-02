// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.


// mocks/MockPayment.ts
export type PaymentSession = {
  id: string;
  amountCents: number;
  currency: string;
  status: 'pending'|'paid'|'failed';
  createdAt: number;
  metadata?: Record<string, any>;
};

const STORE_KEY = 'pdfx_mock_payments';

function readAll(): PaymentSession[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function writeAll(sessions: PaymentSession[]) {
  localStorage.setItem(STORE_KEY, JSON.stringify(sessions));
}

export const MockPayment = {
  createSession(amountCents: number, currency = 'usd', metadata?: Record<string, any>): PaymentSession {
    const s: PaymentSession = {
      id: 'mockpay_' + Date.now() + '_' + Math.floor(Math.random()*10000),
      amountCents,
      currency,
      status: 'pending',
      createdAt: Date.now(),
      metadata
    };
    const all = readAll();
    all.push(s);
    writeAll(all);
    return s;
  },
  confirmSession(sessionId: string): PaymentSession | null {
    const all = readAll();
    const s = all.find(x => x.id === sessionId);
    if (!s) return null;
    s.status = 'paid';
    writeAll(all);
    return s;
  },
  list(): PaymentSession[] { return readAll().sort((a,b) => b.createdAt - a.createdAt); },
  clear() { writeAll([]); }
};

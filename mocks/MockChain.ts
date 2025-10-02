// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.


// mocks/MockChain.ts
export type ChainEvent = {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
};

const KEY = 'pdfx_mock_chain';

function read(): ChainEvent[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e) { return []; }
}
function write(arr: ChainEvent[]) { localStorage.setItem(KEY, JSON.stringify(arr)); }

export const MockChain = {
  push(type: string, payload: any) {
    const arr = read();
    const ev: ChainEvent = { id: 'ev_' + Date.now() + '_' + Math.floor(Math.random()*10000), type, payload, timestamp: Date.now() };
    arr.push(ev);
    write(arr);
    return ev;
  },
  list() { return read().sort((a, b) => b.timestamp - a.timestamp); },
  clear() { write([]); }
};

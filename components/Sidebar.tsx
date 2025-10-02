// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.


import React from 'react';
import { Script, PaymentOption, Monetization, MonetizationType } from '../types';
import ScriptIcon from './icons/ScriptIcon';
import PaymentIcon from './icons/PaymentIcon';
import BlockchainIcon from './icons/BlockchainIcon';
import ServerIcon from './icons/ServerIcon';
import { PaymentSession } from '../mocks/MockPayment';
import { ChainEvent } from '../mocks/MockChain';


const SCRIPTS: Script[] = [
  { id: 'watermark', name: 'Auto Watermarking', description: 'Dynamically add watermarks to the document.', code: `// Auto Watermark Script
// Try changing the page number or the text!
// Example: watermark page 2 text "DRAFT"
applyWatermark(pdfDoc, 'CONFIDENTIAL');` },
  { id: 'pay-to-view', name: 'View-to-Pay Trigger', description: 'Require payment after a certain number of views.', code: `// View-to-Pay Trigger Script
// This script simulates locking pages and creating a payment session.
// Try changing the price! e.g., "unlock for $10"
unlock pages for $5;` },
  { id: 'time-unlock', name: 'Time-Based Unlocking', description: 'Unlock pages after a specific time.', code: `// Time-Based Page Unlocking Script
// This is a placeholder for a future feature.
// The MockAI doesn't have a heuristic for this yet.
// See what it does as a fallback!
unlock page 5 at timestamp 1672531200;` },
  { id: 'ai-qa', name: 'AI Q&A on Content', description: 'Enable AI to answer questions about the doc.', code: `// AI Q&A Script
// This script simulates minting an NFT of the document.
// The AI interprets "mint" and logs it to the mock chain.
mint nft of this document version;` },
];

interface SidebarProps {
  onScriptSelect: (script: Script) => void;
  paymentOptions: PaymentOption[];
  onPaymentOptionChange: (id: string) => void;
  monetization: Monetization;
  onMonetizationChange: (monetization: Monetization) => void;
  paymentSessions: PaymentSession[];
  chainEvents: ChainEvent[];
  onConfirmPayment: (sessionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onScriptSelect, paymentOptions, onPaymentOptionChange, monetization, onMonetizationChange, paymentSessions, chainEvents, onConfirmPayment }) => {
  return (
    <aside className="w-80 bg-gray-900 border-r border-gray-800 p-4 flex-shrink-0 flex flex-col space-y-8 overflow-y-auto">
      {/* Script Library */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center"><ScriptIcon className="w-4 h-4 mr-2" /> Script Library</h2>
        <div className="space-y-2">
          {SCRIPTS.map(script => (
            <button key={script.id} onClick={() => onScriptSelect(script)} className="w-full text-left p-2 rounded-md bg-gray-800 hover:bg-indigo-600 transition-colors duration-200">
              <p className="font-semibold text-sm">{script.name}</p>
              <p className="text-xs text-gray-400">{script.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Layer */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center"><PaymentIcon className="w-4 h-4 mr-2" /> Embedded Payments</h2>
        <div className="space-y-3">
          {paymentOptions.map(option => (
             <label key={option.id} className="flex items-center justify-between p-2 bg-gray-800 rounded-md cursor-pointer">
              <span className="text-sm font-medium">{option.name}</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" checked={option.enabled} onChange={() => onPaymentOptionChange(option.id)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                <span className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></span>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      {/* Monetization */}
      <div>
         <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center"><BlockchainIcon className="w-4 h-4 mr-2" /> Monetization</h2>
         <div className="space-y-3 p-3 bg-gray-800 rounded-md">
            <div>
              <label htmlFor="monetization-type" className="block text-xs font-medium text-gray-400 mb-1">Pricing Model</label>
              <select 
                id="monetization-type"
                value={monetization.type}
                onChange={(e) => onMonetizationChange({...monetization, type: e.target.value as MonetizationType})}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {Object.values(MonetizationType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="monetization-price" className="block text-xs font-medium text-gray-400 mb-1">Price (USD)</label>
               <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                <input 
                  type="number"
                  id="monetization-price"
                  value={monetization.price}
                  onChange={(e) => onMonetizationChange({...monetization, price: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 pl-7 bg-gray-700 border border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
         </div>
         <p className="text-xs text-gray-500 mt-2">Blockchain logging is enabled by default.</p>
      </div>

       {/* Mock Payments Log */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center"><PaymentIcon className="w-4 h-4 mr-2" /> Mock Payments Log</h2>
        <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-gray-800 rounded-md border border-gray-700">
          {paymentSessions.length > 0 ? paymentSessions.map(session => (
            <div key={session.id} className="text-xs p-2 bg-gray-700 rounded">
              <p className="font-bold text-gray-300 truncate">ID: {session.id}</p>
              <p>Amount: ${(session.amountCents / 100).toFixed(2)}</p>
              <p>Status: <span className={`font-semibold ${session.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>{session.status}</span></p>
              {session.status === 'pending' && (
                <button 
                  onClick={() => onConfirmPayment(session.id)}
                  className="w-full mt-2 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-2 rounded-md text-xs transition-colors duration-200">
                  Confirm Payment
                </button>
              )}
            </div>
          )) : <p className="text-xs text-gray-500 text-center p-2">No payment sessions yet.</p>}
        </div>
      </div>

      {/* Mock Chain Log */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center"><ServerIcon className="w-4 h-4 mr-2" /> Mock Chain Log</h2>
        <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-gray-800 rounded-md border border-gray-700">
           {chainEvents.length > 0 ? chainEvents.map(event => (
            <div key={event.id} className="text-xs p-2 bg-gray-700 rounded font-mono">
              <p className="text-indigo-400 font-bold">{event.type}</p>
              <p className="text-gray-400">{new Date(event.timestamp).toLocaleTimeString()}</p>
              <p className="text-gray-500 text-[10px] break-words">{JSON.stringify(event.payload)}</p>
            </div>
          )) : <p className="text-xs text-gray-500 text-center p-2">No chain events recorded.</p>}
        </div>
      </div>


      <style>{`
        .toggle-checkbox:checked { right: 0; border-color: #4f46e5; }
        .toggle-checkbox:checked + .toggle-label { background-color: #4f46e5; }
      `}</style>
    </aside>
  );
};

export default Sidebar;

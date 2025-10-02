// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.


import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import Terminal from './components/Terminal';
import { Script, PaymentOption, MonetizationType } from './types';
import { generateContent } from './services/geminiService';
import { debugScriptWithMockAI } from './services/mockAiService';
import { runScriptInMockSandbox } from './mocks/SandboxRunner';
import { MockPayment, PaymentSession } from './mocks/MockPayment';
import { MockChain, ChainEvent } from './mocks/MockChain';


const App: React.FC = () => {
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [scriptContent, setScriptContent] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>(['Welcome to the PDFX Mock AI Runtime.']);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([
    { id: 'stripe', name: 'Stripe', enabled: true },
    { id: 'ethereum', name: 'Ethereum', enabled: false },
    { id: 'solana', name: 'Solana', enabled: false },
    { id: 'paypal', name: 'PayPal', enabled: true },
  ]);

  const [monetization, setMonetization] = useState({
    type: MonetizationType.PAY_PER_VIEW,
    price: 5,
  });

  const [appliedEffects, setAppliedEffects] = useState<any[]>([]);
  const [chainEvents, setChainEvents] = useState<ChainEvent[]>([]);
  const [paymentSessions, setPaymentSessions] = useState<PaymentSession[]>([]);

  const refreshMockData = useCallback(() => {
    setChainEvents(MockChain.list());
    setPaymentSessions(MockPayment.list());
  }, []);

  useEffect(() => {
    refreshMockData();
  }, [refreshMockData]);


  const logToConsole = useCallback((message: string) => {
    setConsoleOutput(prev => [...prev, `> ${message}`]);
  }, []);

  const handleFileUpload = (file: File) => {
    setSelectedPdf(file);
    logToConsole(`PDF uploaded: ${file.name}`);
  };

  const handleScriptSelect = (script: Script) => {
    setScriptContent(script.code);
    logToConsole(`Loaded script: ${script.name}`);
  };
  
  const handleRunScript = useCallback(async () => {
    if (!scriptContent.trim()) {
      logToConsole('Error: Cannot run an empty script.');
      return;
    }
    setIsLoading(true);
    logToConsole(`Interpreting script with MockAI Runtime...\n---\n${scriptContent}\n---`);
    
    await runScriptInMockSandbox(scriptContent, {
      onLog: (msg) => logToConsole(msg),
      onWatermark: (page, text) => {
        const effect = { type: 'WATERMARK', page, text, id: Date.now() };
        setAppliedEffects(prev => [effect, ...prev]);
        logToConsole(`EFFECT APPLIED: Watermark on page ${page} with text "${text}"`);
      },
      onHighlight: (text) => {
        const effect = { type: 'HIGHLIGHT', text, id: Date.now() };
        setAppliedEffects(prev => [effect, ...prev]);
        logToConsole(`EFFECT APPLIED: Highlight text "${text}"`);
      },
      onLockPages: (pages, price) => {
         const effect = { type: 'LOCK_PAGES', pages, price, id: Date.now() };
         setAppliedEffects(prev => [effect, ...prev]);
         logToConsole(`EFFECT APPLIED: Locked pages [${pages.join(', ')}] for $${((price || 0)/100).toFixed(2)}`);
      },
      onMintNFT: (metadata) => {
        const effect = { type: 'MINT_NFT', metadata, id: Date.now() };
        setAppliedEffects(prev => [effect, ...prev]);
        logToConsole(`EFFECT APPLIED: Minted NFT with metadata: ${JSON.stringify(metadata)}`);
      }
    });

    refreshMockData();
    logToConsole('--- MockAI interpretation finished ---');
    setIsLoading(false);
  }, [scriptContent, logToConsole, refreshMockData]);

  const handleDebugWithAI = useCallback(async () => {
    if (!scriptContent.trim()) {
      logToConsole('Error: Cannot debug an empty script.');
      return;
    }
    setIsLoading(true);
    logToConsole('Asking MockAI for debugging help...');
    try {
      const simulatedError = "TypeError: Cannot read properties of null (reading 'data')";
      const aiResponse = await debugScriptWithMockAI(scriptContent, simulatedError);
      logToConsole(`MockAI Debugger:\n---\n${aiResponse}\n---`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      logToConsole(`Error debugging with MockAI: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [scriptContent, logToConsole]);

  const handleGenerateContent = async () => {
    if (!documentContent.trim()) {
        logToConsole("Cannot generate from empty content. Write a prompt in the editor.");
        return;
    }
    setIsLoading(true);
    logToConsole("Generating content with AI...");
    try {
      const aiResponse = await generateContent(documentContent);
      setDocumentContent(prev => `${prev}\n\n${aiResponse}`);
      logToConsole("AI content generation successful.");
    } catch(error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      logToConsole(`Error generating content with AI: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = (sessionId: string) => {
    logToConsole(`Attempting to confirm mock payment: ${sessionId}`);
    const confirmed = MockPayment.confirmSession(sessionId);
    if (confirmed) {
      logToConsole(`Payment ${sessionId} confirmed successfully!`);
      MockChain.push('payment_confirmed', { sessionId });
      refreshMockData();
    } else {
      logToConsole(`Failed to confirm payment ${sessionId}.`);
    }
  };


  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex overflow-hidden">
        <Sidebar 
          onScriptSelect={handleScriptSelect}
          paymentOptions={paymentOptions}
          onPaymentOptionChange={(id) => {
            setPaymentOptions(prev => 
              prev.map(opt => opt.id === id ? { ...opt, enabled: !opt.enabled } : opt)
            );
          }}
          monetization={monetization}
          onMonetizationChange={setMonetization}
          paymentSessions={paymentSessions}
          chainEvents={chainEvents}
          onConfirmPayment={handleConfirmPayment}
        />
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          <Workspace
            selectedPdf={selectedPdf}
            onFileUpload={handleFileUpload}
            documentContent={documentContent}
            onDocumentChange={setDocumentContent}
            onGenerateContent={handleGenerateContent}
            isLoading={isLoading}
            appliedEffects={appliedEffects}
          />
          <Terminal
            scriptContent={scriptContent}
            onScriptChange={setScriptContent}
            consoleOutput={consoleOutput}
            onRun={handleRunScript}
            onDebug={handleDebugWithAI}
            onClear={() => setConsoleOutput(['Console cleared.'])}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default App;

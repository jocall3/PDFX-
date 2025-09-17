
import React, { useEffect, useRef } from 'react';
import CodeIcon from './icons/CodeIcon';
import AIIcon from './icons/AIIcon';

interface TerminalProps {
  scriptContent: string;
  onScriptChange: (content: string) => void;
  consoleOutput: string[];
  onRun: () => void;
  onDebug: () => void;
  onClear: () => void;
  isLoading: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ scriptContent, onScriptChange, consoleOutput, onRun, onDebug, onClear, isLoading }) => {
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleOutput]);

  return (
    <div className="w-full md:w-2/5 flex flex-col bg-gray-900 border-l border-gray-800 flex-shrink-0 overflow-hidden">
      <div className="flex-shrink-0 p-3 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-300 flex items-center"><CodeIcon className="w-5 h-5 mr-2" /> JS Execution Terminal</h2>
        <div className="flex space-x-2">
            <button onClick={onRun} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded-md transition-colors disabled:bg-green-900 disabled:cursor-not-allowed">
                {isLoading ? 'Running...' : 'Run'}
            </button>
            <button onClick={onDebug} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-3 rounded-md flex items-center transition-colors disabled:bg-indigo-900 disabled:cursor-not-allowed">
                <AIIcon className="w-4 h-4 mr-1"/>
                {isLoading ? 'Debugging...' : 'Debug'}
            </button>
            <button onClick={onClear} disabled={isLoading} className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold py-1 px-3 rounded-md transition-colors disabled:opacity-50">Clear</button>
        </div>
      </div>
      
      {/* Code Editor */}
      <div className="flex-grow flex flex-col h-1/2">
        <textarea
          value={scriptContent}
          onChange={(e) => onScriptChange(e.target.value)}
          placeholder="Write or load a script to execute on the PDF..."
          className="w-full h-full p-3 bg-gray-900 text-green-300 font-mono text-sm resize-none focus:outline-none"
        />
      </div>

      {/* Console Output */}
      <div className="flex-shrink-0 border-t border-gray-800 h-1/2 flex flex-col">
        <h3 className="text-xs font-semibold text-gray-400 bg-gray-900 px-3 py-1 border-b border-gray-800">Console Log</h3>
        <div className="flex-grow p-3 bg-black bg-opacity-20 overflow-y-auto font-mono text-xs">
          {consoleOutput.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">{line}</div>
          ))}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  );
};

export default Terminal;


import React, { useState, useRef } from 'react';
import DocumentIcon from './icons/DocumentIcon';
import AIIcon from './icons/AIIcon';

interface WorkspaceProps {
  selectedPdf: File | null;
  onFileUpload: (file: File) => void;
  documentContent: string;
  onDocumentChange: (content: string) => void;
  onGenerateContent: () => void;
  isLoading: boolean;
  appliedEffects: any[];
}

const Workspace: React.FC<WorkspaceProps> = ({ selectedPdf, onFileUpload, documentContent, onDocumentChange, onGenerateContent, isLoading, appliedEffects }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'pdf'>('editor');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileUpload(event.target.files[0]);
      setActiveTab('pdf');
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-800 m-2 rounded-lg overflow-hidden border border-gray-700">
      <div className="flex-shrink-0 bg-gray-900 flex items-center border-b border-gray-700">
        <button 
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'editor' ? 'text-white bg-gray-700' : 'text-gray-400 hover:bg-gray-800'}`}
        >
          Editor / Notepad
        </button>
        <button 
          onClick={() => setActiveTab('pdf')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'pdf' ? 'text-white bg-gray-700' : 'text-gray-400 hover:bg-gray-800'}`}
        >
          PDF View
        </button>
      </div>

      <div className="flex-grow p-4 overflow-auto relative">
        {activeTab === 'editor' && (
          <div className="h-full flex flex-col">
            <textarea
              value={documentContent}
              onChange={(e) => onDocumentChange(e.target.value)}
              placeholder="Live markdown and rich-text editor... Type a prompt and click 'Generate with AI'!"
              className="w-full h-full p-3 bg-gray-800 text-gray-200 resize-none focus:outline-none font-mono text-sm"
            />
            <button 
              onClick={onGenerateContent} 
              disabled={isLoading}
              className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md flex items-center transition-all duration-200 disabled:bg-indigo-900 disabled:cursor-not-allowed"
            >
              <AIIcon className="w-5 h-5 mr-2"/>
              {isLoading ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
        )}
        {activeTab === 'pdf' && (
          <div className="h-full flex items-center justify-center flex-col">
            <div className="flex-grow w-full flex items-center justify-center flex-col">
              {selectedPdf ? (
                <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
                  <DocumentIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white">PDF Viewer Area</h3>
                  <p className="text-gray-400 mt-2">Loaded: <span className="font-medium text-indigo-400">{selectedPdf.name}</span></p>
                  <p className="text-xs text-gray-500 mt-1">Size: {(selectedPdf.size / 1024).toFixed(2)} KB</p>
                  <button 
                    onClick={handleUploadClick} 
                    className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors duration-200"
                  >
                    Upload a Different PDF
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <DocumentIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-white">No PDF Uploaded</h3>
                  <p className="text-gray-400 mt-2">Upload a PDF to see the preview and run scripts on it.</p>
                  <button 
                    onClick={handleUploadClick} 
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Upload PDF
                  </button>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
            
            {appliedEffects.length > 0 && (
              <div className="w-full mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700 flex-shrink-0">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Applied Mock Effects</h4>
                <div className="text-xs text-gray-400 space-y-2 max-h-32 overflow-y-auto font-mono">
                  {appliedEffects.map(effect => (
                    <div key={effect.id} className="p-2 bg-gray-800 rounded-md">
                      <strong className="text-indigo-400">{effect.type}:</strong> 
                      <pre className="whitespace-pre-wrap text-gray-300 text-[11px] mt-1">{JSON.stringify(effect, (k,v) => k === 'id' || k === 'type' ? undefined : v, 2)}</pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;

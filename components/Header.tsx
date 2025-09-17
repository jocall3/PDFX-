
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center z-10 shadow-md">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center font-bold text-white">P</div>
        <h1 className="text-xl font-bold text-white tracking-wider">PDFX</h1>
        <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">Godmode</span>
      </div>
      <div className="flex items-center space-x-4">
         <span className="text-sm text-gray-400">James</span>
         <img src="https://picsum.photos/40/40" alt="User Avatar" className="w-8 h-8 rounded-full border-2 border-gray-600"/>
      </div>
    </header>
  );
};

export default Header;

'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const maxLength = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (input.trim() === '' || disabled) return;
    
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, new line on Shift+Enter (only on desktop)
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth >= 640) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const remainingChars = maxLength - input.length;
  const isNearLimit = remainingChars < 50;

  return (
    <form onSubmit={handleSubmit} className="space-y-1 sm:space-y-2">
      <div className="flex gap-1.5 sm:gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder="Ask about the weather..."
          disabled={disabled}
          rows={1}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
        />
        <button
          type="submit"
          disabled={disabled || input.trim() === ''}
          className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md sm:shadow-lg disabled:shadow-none whitespace-nowrap"
        >
          {disabled ? (
            <span className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="hidden sm:inline">Sending...</span>
            </span>
          ) : (
            'Send'
          )}
        </button>
      </div>
      
      {/* Character Counter - More compact on mobile */}
      {input.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-[10px] sm:text-xs px-1">
          <span className="text-gray-400 hidden sm:inline">
            Press Enter to send, Shift+Enter for new line
          </span>
          <span className="text-gray-400 sm:hidden">
            Tap Send button to submit
          </span>
          <span className={`${isNearLimit ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
            {remainingChars} chars left
          </span>
        </div>
      )}
    </form>
  );
}
import { Message } from '../types/chat';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export default function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getWeatherIcon = (content: string) => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('sunny') || lowerContent.includes('clear')) return '☀️';
    if (lowerContent.includes('rain') || lowerContent.includes('drizzle')) return '🌧️';
    if (lowerContent.includes('cloud')) return '☁️';
    if (lowerContent.includes('snow')) return '❄️';
    if (lowerContent.includes('thunder')) return '⚡';
    if (lowerContent.includes('wind') || lowerContent.includes('breeze')) return '💨';
    if (lowerContent.includes('mist') || lowerContent.includes('fog')) return '🌫️';
    return null;
  };

  const weatherIcon = !isUser ? getWeatherIcon(message.content) : null;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4 animate-fadeIn`}>
      <div
        className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-3 shadow-md transition-colors duration-200 ${
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white rounded-br-none'
            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600'
        }`}
      >
        <div className="flex gap-2">
          {!isUser && weatherIcon && (
            <span className="text-base sm:text-lg flex-shrink-0 mt-0.5">{weatherIcon}</span>
          )}
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        
        {isLoading && (
          <div className="flex gap-1 mt-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        
        {!isLoading && (
          <div className={`flex items-center gap-1 mt-1 sm:mt-2 ${isUser ? 'justify-end text-blue-100' : 'justify-start text-gray-400 dark:text-gray-500'}`}>
            <span className="text-[10px] sm:text-xs">
              {message.timestamp.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            {isUser && (
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            
            <button
              onClick={handleCopy}
              className={`ml-2 transition-colors ${isCopied ? 'text-green-500' : isUser ? 'text-blue-200 hover:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="Copy message"
              aria-label="Copy message"
            >
              {isCopied ? (
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>

            {!isUser && (
              <div className="flex items-center gap-2 ml-2">
                <button 
                  onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                  className={`transition-colors ${feedback === 'up' ? 'text-green-500' : 'hover:text-gray-600 dark:hover:text-gray-300'}`}
                  aria-label="Thumbs up"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </button>
                <button 
                  onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                  className={`transition-colors ${feedback === 'down' ? 'text-red-500' : 'hover:text-gray-600 dark:hover:text-gray-300'}`}
                  aria-label="Thumbs down"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
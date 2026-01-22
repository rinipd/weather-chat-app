import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export default function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4 animate-fadeIn`}>
      <div
        className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-3 shadow-md ${
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
        }`}
      >
        {/* Message Content */}
        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-1 mt-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        
        {/* Timestamp */}
        {!isLoading && (
          <p className={`text-[10px] sm:text-xs mt-1 sm:mt-2 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
            {message.timestamp.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import ErrorMessage from '../components/ErrorMessage';
import ThemeToggle from '../components/ThemeToggle';
import { Message } from '../types/chat';
import { sendMessageToAgent } from '../services/weatherApi';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, error]);

  const handleSendMessage = async (content: string) => {
    if (!content || content.trim() === '') {
      setError('Please enter a message before sending.');
      return;
    }

    if (content.length > 500) {
      setError('Message is too long. Please keep it under 500 characters.');
      return;
    }

    setError(null);
    setLastUserMessage(content);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const agentMessageId = (Date.now() + 1).toString();
    const agentMessage: Message = {
      id: agentMessageId,
      role: 'agent',
      content: '',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, agentMessage]);

    try {
      let hasReceivedData = false;

      await sendMessageToAgent(content, (chunk) => {
        hasReceivedData = true;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === agentMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      });

      if (!hasReceivedData) {
        throw new Error('No response received from the server.');
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error:', error);
      
      setMessages((prev) => prev.filter((msg) => msg.id !== agentMessageId));
      
      let errorMessage = 'Failed to get a response. Please try again.';
      
      if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. The server took too long to respond.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again in a moment.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage);
    }
  };

  const handleClearChat = () => {
    if (messages.length > 0) {
      const confirmed = window.confirm('Are you sure you want to clear the chat history?');
      if (confirmed) {
        setMessages([]);
        setError(null);
        setLastUserMessage('');
      }
    }
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    
    const chatContent = messages
      .map(m => `[${new Date(m.timestamp).toLocaleString()}] ${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredMessages = messages.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-start sm:justify-center p-2 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-3 sm:mb-6 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2 transition-colors">
            Weather Chat Assistant ⛅
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 transition-colors">
            Ask me about weather conditions anywhere!
          </p>
        </div>
        
        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-120px)] sm:h-auto transition-colors duration-200">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 px-3 sm:px-6 py-2 sm:py-4 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm sm:text-base font-medium">Online</span>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className="p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
                aria-label="Search messages"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <ThemeToggle />
              
              {messages.length > 0 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={handleExportChat}
                    className="p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
                    title="Export Chat"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={handleClearChat}
                    className="px-2 sm:px-4 py-1 sm:py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm rounded-md sm:rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          {isSearchVisible && (
            <div className="px-3 sm:px-6 py-2 bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600 transition-all duration-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  autoFocus
                />
                <svg className="absolute left-3 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-0 transition-colors duration-200">
            {messages.length === 0 && !error ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🌤️</div>
                <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-2">Start a conversation!</p>
                <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 max-w-md mb-4">
                  Try: "What's the weather in Mumbai?" or "Will it rain in London?"
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  <button
                    onClick={() => handleSendMessage("What's the weather in New York?")}
                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs rounded-full transition-colors"
                  >
                    Weather in New York?
                  </button>
                  <button
                    onClick={() => handleSendMessage("Will it rain tomorrow in Tokyo?")}
                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs rounded-full transition-colors"
                  >
                    Rain in Tokyo?
                  </button>
                </div>
              </div>
            ) : searchQuery && filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <p>No messages found matching "{searchQuery}"</p>
              </div>
            ) : (
              <>
                {(searchQuery ? filteredMessages : messages).map((message) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message}
                    isLoading={message.role === 'agent' && isLoading && message.content === ''}
                  />
                ))}
                
                {error && <ErrorMessage message={error} onRetry={handleRetry} />}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Input Area */}
          <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex-shrink-0 transition-colors duration-200">
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Footer */}
        <p className="hidden sm:block text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 sm:mt-4 transition-colors">
          Powered by AI • Real-time weather data
        </p>
      </div>
    </main>
  );
}
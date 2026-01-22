'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import ErrorMessage from '../components/ErrorMessage';
import { Message } from '../types/chat';
import { sendMessageToAgent } from '../services/weatherApi';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, error]);

  const handleSendMessage = async (content: string) => {
    // Validation: Check for empty message
    if (!content || content.trim() === '') {
      setError('Please enter a message before sending.');
      return;
    }

    // Validation: Check message length
    if (content.length > 500) {
      setError('Message is too long. Please keep it under 500 characters.');
      return;
    }

    // Clear any previous errors
    setError(null);
    
    // Store last message for retry functionality
    setLastUserMessage(content);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Create a placeholder for agent response
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

      // Call API with streaming
      await sendMessageToAgent(content, (chunk) => {
        hasReceivedData = true;
        // Update agent message with each chunk
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === agentMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      });

      // Check if we received any data
      if (!hasReceivedData) {
        throw new Error('No response received from the server.');
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error:', error);
      
      // Remove the empty agent message
      setMessages((prev) => prev.filter((msg) => msg.id !== agentMessageId));
      
      // Determine error type and show appropriate message
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-start sm:justify-center p-2 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-3 sm:mb-6 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
            Weather Chat Assistant ⛅
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">
            Ask me about weather conditions anywhere!
          </p>
        </div>
        
        {/* Chat Container */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-120px)] sm:h-auto">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-3 sm:px-6 py-2 sm:py-4 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm sm:text-base font-medium">Online</span>
            </div>
            
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="px-2 sm:px-4 py-1 sm:py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm rounded-md sm:rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-50 min-h-0">
            {messages.length === 0 && !error ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🌤️</div>
                <p className="text-gray-500 text-base sm:text-lg mb-2">Start a conversation!</p>
                <p className="text-xs sm:text-sm text-gray-400 max-w-md mb-4">
                  Try: "What's the weather in Mumbai?" or "Will it rain in London?"
                </p>
                
                {/* Example queries */}
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  <button
                    onClick={() => handleSendMessage("What's the weather in New York?")}
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-full transition-colors"
                  >
                    Weather in New York?
                  </button>
                  <button
                    onClick={() => handleSendMessage("Will it rain tomorrow in Tokyo?")}
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-full transition-colors"
                  >
                    Rain in Tokyo?
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message}
                    isLoading={message.role === 'agent' && isLoading && message.content === ''}
                  />
                ))}
                
                {/* Error Display */}
                {error && <ErrorMessage message={error} onRetry={handleRetry} />}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Input Area */}
          <div className="border-t bg-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex-shrink-0">
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Footer */}
        <p className="hidden sm:block text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
          Powered by AI • Real-time weather data
        </p>
      </div>
    </main>
  );
}
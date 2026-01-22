interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex justify-center mb-4 animate-fadeIn">
      <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[75%] bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-md">
        <div className="flex items-start gap-3">
          {/* Error Icon */}
          <div className="flex-shrink-0">
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          
          {/* Error Content */}
          <div className="flex-1">
            <p className="text-sm sm:text-base text-red-800 font-medium mb-1">
              Oops! Something went wrong
            </p>
            <p className="text-xs sm:text-sm text-red-600 mb-3">
              {message}
            </p>
            
            {/* Retry Button */}
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
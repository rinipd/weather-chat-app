// Types for our chat messages
export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

// Simplified API request for new endpoint
export interface WeatherAPIRequest {
  prompt: string;
  stream: boolean;
}

// API Response (we'll handle streaming chunks)
export interface APIError {
  message: string;
  statusCode?: number;
}
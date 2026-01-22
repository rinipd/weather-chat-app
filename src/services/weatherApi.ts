const API_ENDPOINT = '/api/chat';

/**
 * Sends a user prompt to the chat agent and processes the streaming response.
 * @param prompt - The user's input message
 * @param onChunk - Callback triggered for each received text fragment
 * @returns Promise resolving to the complete message content
 */
export async function sendMessageToAgent(
  prompt: string,
  onChunk?: (text: string) => void
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('Response status:', response.status);

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else if (response.status === 404) {
        throw new Error('Service not found. Please contact support.');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    if (!reader) {
      throw new Error('Unable to read response. Please try again.');
    }

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('Stream complete. Full text length:', fullText.length);
        break;
      }
      
      const chunk = decoder.decode(value, { stream: true });
      console.log('Received chunk length:', chunk.length);
      fullText += chunk;
      
      // Call the callback with each chunk (for real-time display)
      if (onChunk) {
        onChunk(chunk);
      }
    }

    // Validate we got some response
    if (fullText.trim().length === 0) {
      throw new Error('Received empty response from server.');
    }

    return fullText;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. The server took too long to respond.');
    }
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    console.error('Error calling weather API:', error);
    throw error;
  }
}
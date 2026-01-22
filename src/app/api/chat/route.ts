import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json().catch(() => null);
    
    if (!body || !body.prompt) {
      return NextResponse.json(
        { error: 'Invalid request. Missing prompt.' },
        { status: 400 }
      );
    }

    const { prompt } = body;

    // Validate prompt
    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt must be a non-empty string.' },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt is too long. Maximum 500 characters.' },
        { status: 400 }
      );
    }

    console.log('Received prompt:', prompt);

    const apiUrl = process.env.WEATHER_AGENT_API_URL || 'https://api-dev.provue.ai/api/webapp/agent/test-agent';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'x-mastra-dev-playground': 'true',
      },
      body: JSON.stringify({
        prompt,
        stream: true,
      }),
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      
      // Return appropriate error based on status
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: `API returned error: ${response.status}` },
        { status: response.status }
      );
    }

    // Create a TransformStream to process SSE data
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Process the stream in the background
    (async () => {
      try {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No reader available');
        }

        let buffer = '';
        let hasData = false;

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            // Check if we received any data
            if (!hasData) {
              await writer.write(encoder.encode('Error: No data received from the server.'));
            }
            await writer.close();
            break;
          }

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            // SSE format: "data: {...}"
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.slice(6); // Remove "data: " prefix
                const data = JSON.parse(jsonStr);
                
                // Only send text-delta events to client
                if (data.type === 'text-delta' && data.payload?.text) {
                  hasData = true;
                  await writer.write(encoder.encode(data.payload.text));
                }
              } catch (e) {
                // Ignore parse errors for non-JSON lines
                console.log('Skipping line:', line.substring(0, 50));
              }
            }
          }
        }
      } catch (error) {
        console.error('Stream processing error:', error);
        await writer.abort(error);
      }
    })();

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
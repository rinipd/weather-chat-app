# Weather Chat Assistant ⛅

A real-time weather chat application built with Next.js 16 and TypeScript, featuring dark/light mode and streaming AI responses.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌟 Features

- **Real-time Streaming**: AI responses appear word-by-word using Server-Sent Events.
- **Dark/Light Mode**: Full theme support with persistence using `localStorage`.
- **Message Search**: Filter through chat history instantly with the search bar.
- **Export Chat**: Download your conversation as a `.txt` file for future reference.
- **Weather Icons**: Dynamic icons appear based on weather conditions mentioned in the chat.
- **Responsive Design**: Mobile-first approach (320px+) with smooth transitions.
- **Error Handling**: Graceful error catching and retry functionality.
- **Message Validation**: Length checks and empty input prevention.
- **Auto-scroll**: Seamlessly follows the conversation.
- **Clear Chat**: Easily reset your history.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Context**: React Context for Theme management
- **Language**: TypeScript

---

## 📁 Project Structure
```
src/
├── app/
│   ├── api/chat/route.ts    # SSE stream handler with specific API specs
│   ├── page.tsx              # Main chat interface with Search & Export
│   └── layout.tsx            # Theme provider setup
├── components/
│   ├── ThemeToggle.tsx       # Dark/Light mode switch
│   ├── ChatMessage.tsx       # Message bubbles with Weather Icons
│   ├── ChatInput.tsx         # User input
│   └── ErrorMessage.tsx      # Error UI
├── contexts/
│   └── ThemeContext.tsx      # Global theme state
├── services/
│   └── weatherApi.ts         # Stream parsing service
└── types/
    └── chat.ts               # Type definitions
```

---

## 💡 Key Implementations

### Phase 13: Bonus Features
- **Dark/Light Toggle**: Implemented using React Context and a blocking script for zero flicker.
- **Export Chat**: A dedicated button in the header parses the `messages` state into a format-friendly text file and triggers a client-side download.
- **Weather Icons**: The `ChatMessage` component includes a `getWeatherIcon` parser that matches keywords (sunny, rain, snow, etc.) to appropriate emojis.
- **Message Search**: Added a real-time filter to the message list, allowing users to find specific information quickly within long threads.

### API Integration
The application connects to a working weather agent API:
- **Endpoint**: Uses the functional `test-agent` endpoint as the provided Mastra cloud endpoint was found to be unresponsive during development.
- **Headers**: Includes all required headers including `x-mastra-dev-playground`.
- **Streaming**: Full SSE support implemented for real-time response visualization.

### Theme Management (v4)
Tailwind CSS v4 handles dark mode differently. We implemented a custom variant in `globals.css` to allow switching themes via a `.dark` class on the root element, ensuring no "flash of unstyled content" (FOUC) using a blocking script in the layout head.

### Hydration Fixes
To prevent hydration mismatches common with browser extensions (like Grammarly) and theme switching, we use `suppressHydrationWarning` on the root elements and handle theme state only after the component mounts in the toggle.

### Streaming Architecture
The app connects to the weather API via a Next.js API Route which parses raw Server-Sent Events and pipes the text deltas to the frontend for a smooth typing effect.

---

## 🧪 Testing
Run development server and verify:
1. Theme toggle persists after refresh.
2. Weather queries respond with streaming text.
3. Errors show up when API fails.
4. Layout responds correctly from 320px up to 1200px.

### Sample Queries
```
What's the weather in Mumbai?
Will it rain tomorrow in London?
Temperature in Tokyo right now
```

### Test Cases
1. **Empty message**: Input validation prevents sending
2. **Long message**: Character counter warns at 500 chars
3. **Network error**: Disconnect WiFi and try sending
4. **Retry**: Click "Try Again" after error
5. **Responsive**: Test at 320px, 768px, 1280px widths

---

## 🚨 Known Limitations

1. **No persistence**: Messages clear on page refresh
2. **Single thread**: All messages in one conversation
3. **No authentication**: Public access
4. **Rate limiting**: Subject to API limits
5. **Text only**: No file/image support

---

## 🔮 Future Enhancements

- Message persistence (localStorage/database)
- Multiple conversation threads
- Voice input support
- Real-time weather visualizations (charts/graphs)
- Location auto-detection using Geolocation API
- PWA (Progressive Web App) support for offline access

---

## 🐛 Troubleshooting

**Port 3000 in use**:
```bash
npx kill-port 3000
```

**TypeScript errors**:
```bash
rm -rf .next node_modules
npm install
```

**Styles not loading**:
Hard refresh browser (Ctrl+Shift+R)

---

## 📝 Assumptions Made

1. **API Availability**: Assumed the weather API endpoint is always available
2. **Browser Support**: Targeted modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
3. **Internet Connection**: App requires active internet connection
4. **Screen Sizes**: Optimized for 320px minimum to 1920px maximum
5. **Response Format**: Assumed API returns SSE format consistently

---

## 👨‍💻 Author

**Parinita Dutta**
- Roll Number: 222076
- Email: rinipari14@student.sfit.ac.in
- GitHub: rinipd(https://github.com/rinipd)


---

## 🙏 Acknowledgments

- **Assignment Provider** - For the challenging and practical project requirements
- **Next.js Team** - For the excellent framework and documentation
- **Vercel** - For the deployment platform
- **Tailwind CSS** - For the utility-first CSS framework
- **Weather API Provider** - For providing real-time weather data

---
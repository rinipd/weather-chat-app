# Weather Chat Assistant ⛅

A real-time weather chat application built with Next.js and TypeScript.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
# Clone repository
git clone 
cd weather-chat-app

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

---

## 🌟 Features

- **Real-time Streaming**: AI responses appear word-by-word
- **Responsive Design**: Works on mobile (320px+), tablet, and desktop
- **Error Handling**: User-friendly error messages with retry
- **Message Validation**: Character limit and empty message checks
- **Auto-scroll**: Automatically scrolls to latest messages
- **Clear Chat**: Reset conversation with confirmation

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Server-Sent Events (SSE) streaming

---

## 📁 Project Structure
```
src/
├── app/
│   ├── api/chat/route.ts    # API proxy for weather agent
│   ├── page.tsx              # Main chat interface
│   └── layout.tsx            # Root layout
├── components/
│   ├── ChatMessage.tsx       # Message display
│   ├── ChatInput.tsx         # Input field
│   └── ErrorMessage.tsx      # Error display
├── services/
│   └── weatherApi.ts         # API service layer
└── types/
    └── chat.ts               # TypeScript definitions
```

---

## 💡 Design Decisions

### Why Next.js API Route?
The weather API requires specific headers that browsers block due to CORS. Using a Next.js API route:
- Bypasses CORS restrictions
- Allows setting all required headers (Connection: keep-alive, etc.)
- Handles Server-Sent Events (SSE) parsing server-side

### Why Server-Sent Events?
The API returns streaming responses in SSE format:
```
data: {"type":"text-delta","payload":{"text":"Hello"}}
```
We parse these events server-side and stream only the text to the client for real-time updates.

### State Management
Used React's built-in `useState` hooks instead of Redux/Context because:
- Simple linear data flow
- No complex state sharing needed
- Smaller bundle size
- Easier to understand and maintain

### Mobile-First Design
Started with mobile (320px) and progressively enhanced for larger screens using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).

---

## 🧪 Testing

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

- Dark mode toggle
- Export chat history (JSON/TXT)
- Message persistence (localStorage/database)
- Weather icons and visualizations
- Multiple conversation threads
- Voice input support

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

Built with Next.js, TypeScript, and Tailwind CSS for [Course/Assignment Name].

---

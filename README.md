# Language Learning Assistant

An interactive language learning application powered by OpenAI's real-time API, featuring voice-based conversations, realtime transcription, and adaptive learning.


### Installation
```bash
# Clone the repository

# Navigate to project directory
cd conversAItion-vite

# Install dependencies
npm install

# Add your OpenAI API key to .env
OPENAI_API_KEY=your_api_key_here

# Start the development server
npm run dev
```

### Running the Local Relay Server
```bash
# Start the relay server
cd relay-server
node index.js
```

## Technologies used:

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: Mantine
- **Audio Processing**: Web Audio API
- **API Integration**: OpenAI Real-time API
- **Styling**: Mantine Core + Tabler Icons


## Configuration

### Environment Variables
```env
VITE_LOCAL_RELAY_SERVER_URL=ws://localhost:8081
VITE_CLERK_PUBLISHABLE_KEY=your_key
VITE_ELEVEN_LABS_SERVER_URL=http://localhost:3001
AGENT_ID=your_agent_id (from eleven labs api dashboard)
```

Adam Malone - [adam-malone@hotmail.co.uk]

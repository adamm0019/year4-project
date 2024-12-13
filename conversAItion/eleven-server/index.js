// some reference: https://stackoverflow.com/questions/78152117/nodejs-twilio-bi-directional-streaming-sending-an-elevenlabs-audio-stream-to-a used to create relay server and avoid CORS errors

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const AGENT_ID = 'TaDOThYRtPGeAcPDnfys';

// configuring cors
const corsOptions = {
  origin: '*', // just allowing all origins for testing, will change later
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};


app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/get-signed-url', async (req, res) => {
  try {
    const response = await fetch(
      // from the eleven labs API docs, using this to get signed url with agent ID from API dashboard
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${AGENT_ID}`,
      {
        method: "GET",
        headers: {
          'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const responseText = await response.text();
    console.log('response:', responseText);

    if (!response.ok) {
      console.error('Eleven Labs API error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });
      throw new Error(`Failed to get signed URL: ${response.statusText}`);
    }

    let body;
    try {
      body = JSON.parse(responseText);
    } catch (e) {
      console.error('failed to get response', e);
      throw new Error('invalid response format from eleven labs');
    }

    console.log('Successfully got signed URL:', body);
    res.json({ signedUrl: body.signed_url });
  } catch (error) {
    console.error('Error getting signed URL:', error);
    res.status(500).json({ error: error.message });
  }
});

// Pre-flight request handling
app.options('*', cors(corsOptions));

app.listen(port, () => {
  // some logging for tesdting purposes
  console.log(`Eleven Labs server listening at http://localhost:${port}`);
  console.log('Using API key:', process.env.ELEVEN_LABS_API_KEY);
  console.log('Using agent ID:', AGENT_ID);
});
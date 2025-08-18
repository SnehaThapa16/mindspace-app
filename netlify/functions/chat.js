// netlify/functions/chat.js
import { TextServiceClient } from '@google/genai';

const client = new TextServiceClient({
  apiKey: process.env.GOOGLE_API_KEY, // Set in Netlify env vars
});

export async function handler(event) {
  try {
    const { message, history } = JSON.parse(event.body);

    const response = await client.generateText({
      model: 'gemini-2.5-flash',
      prompt: message,
      messages: history,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ response: response.text }),
    };
  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

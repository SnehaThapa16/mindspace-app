import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const handler: Handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const userMessage = body.message;

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY, // use env variable
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.text || 'No reply from AI' }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'AI failed' }) };
  }
};

export { handler };

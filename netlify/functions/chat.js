import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const userMessage = body.message;

    if (!userMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No message provided' }),
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: text }),
    };
  } catch (err) {
    console.error('Error in Netlify function:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get response from AI.' }),
    };
  }
};

export { handler };

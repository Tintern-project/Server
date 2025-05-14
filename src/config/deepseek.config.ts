import { OpenAI } from 'openai';

const deepseek = new OpenAI({
    apiKey:process.env.OPENROUTER_API_KEY,
    baseURL:process.env.OPENROUTER_BASE_URL,
  });

export default deepseek;
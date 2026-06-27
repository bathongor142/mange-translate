import OpenAI from "openai";

console.log("ENV FILE LOADED:", process.env.OPENAI_API_KEY);

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

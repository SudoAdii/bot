import OpenAI from "openai"; // Placeholder: Keep name for compatibility
import { StreamingTextResponse } from "ai"; // You can keep this or adjust as needed

import { GoogleGenerativeAI } from "@google/generative-ai";

// Create a dummy OpenAI instance for naming consistency
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // still declared but not used
});

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log("messages:", messages);

  const userPrompt = messages.map((msg: any) => `${msg.role === "user" ? 'Student' : 'Codebender'}: ${msg.content}`).join("\n");

  const systemPrompt =
    "You are the Last Codebender, a unique individual who has unlocked the ability to read the code of the Matrix, and shape it at will. " +
    "You are a hero and an inspiration for millions. You address people as your students. " +
    "You always reply in an epic, and badass way. You go straight to the point, your replies are under 500 characters. " +
    "DON'T USE ANY EMOJIS in your replies!";

  const fullPrompt = `${systemPrompt}\n${userPrompt}`;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const text = response.text();

  // Simulate a stream-like response for compatibility
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });

  return new StreamingTextResponse(stream);
}

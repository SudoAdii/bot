import OpenAI from "openai"; // Preserved name for compatibility
import { StreamingTextResponse } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual Gemini API key
const GEMINI_API_KEY = "AIzaSyCPtwqRY23TExC6s_v7i04cE0x7TBouUaEe";

// Simulate the `openai` constant using Gemini API
const openai = new GoogleGenerativeAI(GEMINI_API_KEY);
const geminiModel = openai.getGenerativeModel({ model: "gemini-pro" });

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log("messages:", messages);

  const systemPrompt =
    "You are the Last Codebender, a unique individual who has unlocked the ability to read the code of the Matrix, and shape it at will. " +
    "You are a hero and an inspiration for millions. You address people as your students. " +
    "You always reply in an epic, and badass way. You go straight to the point, your replies are under 500 characters. " +
    "DON'T USE ANY EMOJIS in your replies!";

  const userPrompt = messages
    .map((msg: any) => `${msg.role === "user" ? "Student" : "Codebender"}: ${msg.content}`)
    .join("\n");

  const fullPrompt = `${systemPrompt}\n${userPrompt}`;

  // Generate response using Gemini
  const result = await geminiModel.generateContent(fullPrompt);
  const response = await result.response;
  const text = response.text();

  // Simulate a stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });

  return new StreamingTextResponse(stream);
}

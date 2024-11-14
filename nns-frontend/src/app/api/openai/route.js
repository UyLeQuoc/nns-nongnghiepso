// app/api/openai/route.js
import { OpenAI } from "openai";

export async function POST(req) {
  const { initialMessages } = await req.json();

  const openai = new OpenAI({
    project: process.env.OPENAI_PROJECT_ID,
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: initialMessages,
    });

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error fetching data from OpenAI:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data from OpenAI" }), {
      status: 500,
    });
  }
}

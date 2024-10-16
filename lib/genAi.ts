import Together from "together-ai";

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export default async function getChatCompletion(message: string) {
  const response = await together.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
  });

  console.log(response?.choices[0]?.message?.content);
  return response?.choices[0]?.message?.content;
}

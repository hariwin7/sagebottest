import type { NextApiRequest, NextApiResponse } from "next";
import getChatCompletion from "@/lib/genAi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { message } = JSON.parse(req.body);
    try {
      const returnMessage = await getChatCompletion(message);

      res.status(200).json(returnMessage);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Failed to generate message from genAi" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

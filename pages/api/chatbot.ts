import type { NextApiRequest, NextApiResponse } from "next";
import getChatCompletion, { matchVector, embedding } from "@/lib/genAi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { message } = JSON.parse(req.body);
    try {
      const embeddingVector = await embedding(message);
      const matchedInformationData = await matchVector(
        embeddingVector[0]?.embedding
      );
      console.log("matchedInformationData", matchedInformationData);
      const augmentedPrompt = `From the celebrity data given below answer the promt:${message}\n
        ${matchedInformationData}\n\n"`;

      const returnMessage = await getChatCompletion(augmentedPrompt);

      res.status(200).json(returnMessage);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Failed to generate message from genAi" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

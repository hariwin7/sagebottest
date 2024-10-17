import type { NextApiRequest, NextApiResponse } from "next";
import { executeEmbedding, saveInVectorDatabase } from "@/lib/genAi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const emebedding = await executeEmbedding();
      console.log(emebedding);
      await saveInVectorDatabase(emebedding);

      res.status(200).json({});
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Failed to generate message from genAi" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

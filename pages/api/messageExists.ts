import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const query = req.query;
      const username: string | undefined = query?.username;

      if (!username)
        return res.status(500).json({ error: "Failed to fetch messages" });

      const countMessages = await prisma.message.count({
        where: {
          username,
        },
      });

      res.status(200).json(countMessages);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

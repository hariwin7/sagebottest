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

      const messages = await prisma.message.findMany({
        where: {
          username,
        },
        orderBy: {
          timestamp: "asc",
        },
      });

      res.status(200).json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  } else if (req.method === "POST") {
    try {
      const { text, username, isUser } = JSON.parse(req.body);

      const data = {
        text,
        username,
        isUser,
      };

      const message = await prisma.message.create({
        data,
      });

      res.status(200).json(message);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Failed to save message" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

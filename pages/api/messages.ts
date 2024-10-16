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
      const username = query?.username;
      if (!username)
        res.status(500).json({ error: "Failed to fetch messages" });
      console.log(query);
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
    console.log("inside");
    try {
      const { text, username, isUser } = JSON.parse(req.body);
      console.log(req.body, "body", text);
      const data = {
        text,
        username,
        isUser,
      };
      console.log(data, "data");
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

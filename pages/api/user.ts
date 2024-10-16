import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username } = req.body;

    try {
      const message = await prisma.users.create({
        data: {
          username,
        },
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

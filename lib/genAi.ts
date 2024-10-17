import Together from "together-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import { dataForRag } from "./data";
import { nanoid } from "nanoid";

const pineCone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export default async function getChatCompletion(message: string) {
  const response = await together.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
  });

  console.log(response?.choices[0]?.message?.content);
  return response?.choices[0]?.message?.content;
}

export async function embedding(message: string | string[]) {
  const response = await together.embeddings.create({
    model: "togethercomputer/m2-bert-80M-8k-retrieval",
    input: message,
  });
  return response?.data;
}

export async function executeEmbedding() {
  const dataForInput = [];
  for (const json of dataForRag) {
    dataForInput.push(json.data);
  }
  const embeddingRes = await embedding(dataForInput);
  console.log(embeddingRes);
  const returnData = [];
  let index = 0;
  for (const val of embeddingRes) {
    returnData.push({
      id: nanoid(),
      values: val.embedding,
      metadata: { text: dataForInput[index] },
    });
    index++;
  }
  return returnData;
}

export async function saveInVectorDatabase(
  emebedding: Array<{
    values: number[];
    id: string;
    metadata: { text: string };
  }>
) {
  const index = pineCone.index(
    "test-index",
    "test-index-3d41i3t.svc.aped-4627-b74a.pinecone.io"
  );
  await index.upsert(emebedding);
}

export async function matchVector(vector: number[]) {
  const index = pineCone.index(
    "test-index",
    "test-index-3d41i3t.svc.aped-4627-b74a.pinecone.io"
  );
  const results = await index.query({
    vector: vector,
    topK: 3,
    includeMetadata: true,
  });
  const matchCelebrity = results.matches[0];
  return matchCelebrity?.metadata?.text;
}

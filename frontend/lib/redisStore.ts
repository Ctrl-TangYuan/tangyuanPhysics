import { createClient } from "redis";

let client: ReturnType<typeof createClient> | null = null;

async function getClient() {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is missing. Add it to Vercel env vars and/or frontend/.env.local");
  }

  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on("error", (err) => console.error("Redis Client Error", err));
    await client.connect();
  }
  return client;
}

const KEY_PAPERS = "tangyuan:papers";
const KEY_QUESTIONS = "tangyuan:questions";

export async function getJsonArray(key: string): Promise<any[]> {
  const c = await getClient();
  const raw = await c.get(key);
  return raw ? JSON.parse(raw) : [];
}

export async function setJsonArray(key: string, arr: any[]): Promise<void> {
  const c = await getClient();
  await c.set(key, JSON.stringify(arr));
}

export async function getPapers(): Promise<any[]> {
  return getJsonArray(KEY_PAPERS);
}
export async function setPapers(papers: any[]): Promise<void> {
  return setJsonArray(KEY_PAPERS, papers);
}

export async function getQuestions(): Promise<any[]> {
  return getJsonArray(KEY_QUESTIONS);
}
export async function setQuestions(questions: any[]): Promise<void> {
  return setJsonArray(KEY_QUESTIONS, questions);
}

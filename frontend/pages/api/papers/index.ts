import type { NextApiRequest, NextApiResponse } from "next";
import { getPapers, setPapers } from "@/lib/redisStore";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const papers = await getPapers();
    return res.status(200).json({ papers });
  }

  if (req.method === "POST") {
    const { title, school, year, level, examType } = req.body ?? {};
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title is required" });
    }

    const paper = {
      id: uid(),
      title,
      school: typeof school === "string" ? school : undefined,
      year: typeof year === "number" ? year : undefined,
      level: typeof level === "string" ? level : undefined,
      examType: typeof examType === "string" ? examType : undefined,
      createdAt: new Date().toISOString(),
    };

    const papers = await getPapers();
    papers.unshift(paper);
    await setPapers(papers);

    return res.status(201).json({ paper });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

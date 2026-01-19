import type { NextApiRequest, NextApiResponse } from "next";

type Paper = {
  id: string;
  title: string;
  school?: string;
  year?: number;
  level?: string;     // Sec 4 / JC2
  examType?: string;  // prelim/promo/tutorial
  createdAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __tangyuan_papers: Paper[] | undefined;
}

function getStore(): Paper[] {
  if (!global.__tangyuan_papers) global.__tangyuan_papers = [];
  return global.__tangyuan_papers;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const store = getStore();

  if (req.method === "GET") {
    return res.status(200).json({ papers: store });
  }

  if (req.method === "POST") {
    const { title, school, year, level, examType } = req.body ?? {};
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title is required" });
    }

    const paper: Paper = {
      id: uid(),
      title,
      school: typeof school === "string" ? school : undefined,
      year: typeof year === "number" ? year : undefined,
      level: typeof level === "string" ? level : undefined,
      examType: typeof examType === "string" ? examType : undefined,
      createdAt: new Date().toISOString(),
    };

    store.unshift(paper);
    return res.status(201).json({ paper });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

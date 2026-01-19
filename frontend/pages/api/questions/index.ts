import type { NextApiRequest, NextApiResponse } from "next";
import { getQuestions, setQuestions } from "@/lib/redisStore";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function sumMarks(parts: any[]) {
  const nums = parts.map((p) => p.marks).filter((m) => typeof m === "number");
  return nums.length ? nums.reduce((a, b) => a + b, 0) : undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const paperId = typeof req.query.paperId === "string" ? req.query.paperId : undefined;
    const all = await getQuestions();
    const questions = paperId ? all.filter((q) => q.paperId === paperId) : all;
    return res.status(200).json({ questions });
  }

  if (req.method === "POST") {
    const { paperId, qNumber, stemText, parts } = req.body ?? {};
    if (!paperId || typeof paperId !== "string") return res.status(400).json({ error: "paperId required" });
    if (typeof qNumber !== "number") return res.status(400).json({ error: "qNumber must be a number" });
    if (!stemText || typeof stemText !== "string") return res.status(400).json({ error: "stemText required" });
    if (!Array.isArray(parts)) return res.status(400).json({ error: "parts must be an array" });

    const cleanedParts = parts
      .map((p: any) => ({
        label: String(p.label ?? ""),
        text: String(p.text ?? ""),
        marks: typeof p.marks === "number" ? p.marks : undefined,
        answerText: typeof p.answerText === "string" ? p.answerText : undefined,
      }))
      .filter((p: any) => p.label && p.text);

    const question = {
      id: uid(),
      paperId,
      qNumber,
      stemText,
      parts: cleanedParts,
      totalMarks: sumMarks(cleanedParts),
      createdAt: new Date().toISOString(),
    };

    const all = await getQuestions();
    all.push(question);
    await setQuestions(all);

    return res.status(201).json({ question });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

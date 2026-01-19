import type { NextApiRequest, NextApiResponse } from "next";

type QuestionPart = {
  label: string;   // "a", "b.i", "b.ii"
  text: string;
  marks?: number;
  answerText?: string;
};

type Question = {
  id: string;
  paperId: string;
  qNumber: number;
  stemText: string;
  parts: QuestionPart[];
  totalMarks?: number;
  createdAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __tangyuan_questions: Question[] | undefined;
}

function getStore(): Question[] {
  if (!global.__tangyuan_questions) global.__tangyuan_questions = [];
  return global.__tangyuan_questions;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function sumMarks(parts: QuestionPart[]) {
  const nums = parts.map(p => p.marks).filter((m): m is number => typeof m === "number");
  return nums.length ? nums.reduce((a, b) => a + b, 0) : undefined;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const store = getStore();

  if (req.method === "GET") {
    const paperId = typeof req.query.paperId === "string" ? req.query.paperId : undefined;
    const questions = paperId ? store.filter(q => q.paperId === paperId) : store;
    return res.status(200).json({ questions });
  }

  if (req.method === "POST") {
    const { paperId, qNumber, stemText, parts } = req.body ?? {};
    if (!paperId || typeof paperId !== "string") return res.status(400).json({ error: "paperId required" });
    if (typeof qNumber !== "number") return res.status(400).json({ error: "qNumber must be a number" });
    if (!stemText || typeof stemText !== "string") return res.status(400).json({ error: "stemText required" });
    if (!Array.isArray(parts)) return res.status(400).json({ error: "parts must be an array" });

    const cleanedParts: QuestionPart[] = parts.map((p: any) => ({
      label: String(p.label ?? ""),
      text: String(p.text ?? ""),
      marks: typeof p.marks === "number" ? p.marks : undefined,
      answerText: typeof p.answerText === "string" ? p.answerText : undefined,
    })).filter(p => p.label && p.text);

    const q: Question = {
      id: uid(),
      paperId,
      qNumber,
      stemText,
      parts: cleanedParts,
      totalMarks: sumMarks(cleanedParts),
      createdAt: new Date().toISOString(),
    };

    store.push(q);
    return res.status(201).json({ question: q });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

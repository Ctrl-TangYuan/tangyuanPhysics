import type { NextApiRequest, NextApiResponse } from "next";

function getQuestions(): any[] {
  return global.__tangyuan_questions ?? [];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const paperId =
    typeof req.query.paperId === "string" ? req.query.paperId : undefined;

  const qs = getQuestions()
    .filter((q) => !paperId || q.paperId === paperId)
    .sort((a, b) => (a.qNumber ?? 0) - (b.qNumber ?? 0));

  return res.status(200).json({
    title: "Tangyuan Worksheet",
    generatedAt: new Date().toISOString(),
    paperId: paperId ?? null,
    questions: qs.map((q) => ({
      qNumber: q.qNumber,
      stem: q.stemText,
      totalMarks: q.totalMarks ?? null,
      parts: (q.parts ?? []).map((p: any) => ({
        label: p.label,
        text: p.text,
        marks: p.marks ?? null,
      })),
    })),
  });
}

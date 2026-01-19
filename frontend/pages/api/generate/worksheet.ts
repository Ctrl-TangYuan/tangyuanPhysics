import type { NextApiRequest, NextApiResponse } from next;

type QuestionPart = { label string; text string; marks number };
type Question = {
  id string; paperId string; qNumber number; stemText string;
  parts QuestionPart[]; totalMarks number;
};

declare global {
   eslint-disable-next-line no-var
  var __tangyuan_questions Question[]  undefined;
}

function getQuestions() Question[] {
  return global.__tangyuan_questions  [];
}

export default function handler(req NextApiRequest, res NextApiResponse) {
  if (req.method !== GET) return res.status(405).json({ error Method not allowed });

  const paperId = typeof req.query.paperId === string  req.query.paperId  undefined;
  const qs = getQuestions().filter(q = !paperId  q.paperId === paperId)
    .sort((a,b) = a.qNumber - b.qNumber);

  return res.status(200).json({
    title Tangyuan Worksheet,
    generatedAt new Date().toISOString(),
    paperId paperId  null,
    questions qs.map(q = ({
      qNumber q.qNumber,
      stem q.stemText,
      totalMarks q.totalMarks  null,
      parts q.parts.map(p = ({ label p.label, text p.text, marks p.marks  null })),
    })),
  });
}

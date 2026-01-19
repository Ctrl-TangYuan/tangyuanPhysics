export {};

type TangyuanPaper = {
  id: string;
  title: string;
  school?: string;
  year?: number;
  level?: string;
  examType?: string;
  createdAt: string;
};

type TangyuanQuestionPart = {
  label: string;
  text: string;
  marks?: number;
  answerText?: string;
};

type TangyuanQuestion = {
  id: string;
  paperId: string;
  qNumber: number;
  stemText: string;
  parts: TangyuanQuestionPart[];
  totalMarks?: number;
  createdAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __tangyuan_papers: TangyuanPaper[] | undefined;

  // eslint-disable-next-line no-var
  var __tangyuan_questions: TangyuanQuestion[] | undefined;
}

export type essaySubmissionTypeT = "manually" | "upload-images" | "upload-pdf";
export type submitEssayResponseT = {
  essayId: string;
  essaySubmissionType: essaySubmissionTypeT;
  originalEssayWordCount: number;
  reWrittenEssayWordCount: number;
  originalEssay: string;
  reWrittenEssay: string;
  overallEssayEvaluationScore: number;
  evaluationAndScoring: evaluationAndScoringT[];
  essayStructure: essayStructureT[];
};

type evaluationAndScoringT = {
  label: string;
  score: number;
  issuesCount: number;
  issuesList: { before: string; after: string }[];
};

type essayStructureT = {
  label: string;
  features: { label: string; isCorrect: boolean,errorMessage?:string }[];
};

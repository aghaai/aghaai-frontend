import { essaySubmissionTypeT } from "@/types/ai-evaluation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useAIEvaluation() {
  // Send Essay For the evaluation
  const submitEssay = useMutation({
    mutationFn: async ({
      essaySubmissionType,
      essayText,
    }: {
      essayText: string;
      essaySubmissionType: essaySubmissionTypeT;
    }) => {
      const { data } = await axios.post("/api/ai-evaluation", {
        essayText,
        essaySubmissionType,
      });
      return data;
    },
  });

  // Send images to the API and get the extracted text and word count
  const uploadImages = useMutation({
    mutationFn: async (images: File[]) => {
      const formData = new FormData();
      images.forEach((file) => formData.append("images", file));

      const { data } = await axios.post("/api/upload-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    },
  });

  // Upload a single PDF file and get extracted text and word count
  const uploadPdf = useMutation({
    mutationFn: async (pdf: File) => {
      const formData = new FormData();
      formData.append("pdf", pdf);

      const { data } = await axios.post("/api/upload-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    },
  });

  // Return all functions
  return {
    submitEssay,
    uploadImages,
    uploadPdf,
  };
}
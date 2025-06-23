"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAIEvaluation } from "@/hooks/use-ai-evaluation";
import EditUploadedEssayText from "./edit-uploaded-essay-text";
import { Skeleton } from "@/components/ui/skeleton";

const ACCEPTED_PDF_TYPE = ["application/pdf"];

const formSchema = z.object({
  pdf: z
    .array(z.instanceof(File))
    .min(1, "PDF file is required")
    .max(1, "Only one PDF file is allowed"),
});

type FormValues = z.infer<typeof formSchema>;

const UploadPdf = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { pdf: [] },
  });

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  const pdfs = watch("pdf");

  const { uploadPdf } = useAIEvaluation();

  const handleRemove = () => setValue("pdf", []);

  const onDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = Array.from(e.target.files || [])[0];

    if (!newFile) return;
    if (!ACCEPTED_PDF_TYPE.includes(newFile.type)) {
      toast.error("Only PDF files are allowed");
      return;
    }

    setValue("pdf", [newFile]);
    e.target.value = "";
  };

  const onSubmit = (data: FormValues) => {
    uploadPdf.mutate(data.pdf[0]);
  };

  if (uploadPdf.isPending) {
    return (
      <>
        <Skeleton className="h-[70vh]"></Skeleton>
        <div className="flex justify-end">
          <Button variant="outline" type="submit" disabled>
            <Loader2 className="animate-spin mr-2" /> Submit For Review
          </Button>
        </div>
      </>
    );
  }

  if (uploadPdf.isSuccess) {
    return (
      <EditUploadedEssayText
        uploadType="upload-pdf"
        extractedText={uploadPdf.data.extractedText}
        wordCount={uploadPdf.data.wordCount}
      />
    );
  }

  return (
    <>
      <form
        className="border rounded-md bg-card h-[70vh] p-4 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Label className="text-lg font-semibold">Upload PDF</Label>
        <p className="text-sm text-muted-foreground -mt-2">
          Only one PDF file allowed.
        </p>

        <Controller
          control={control}
          name="pdf"
          render={() => (
            <div className="flex flex-wrap gap-4">
              {pdfs.length > 0 && (
                <div className="relative w-32 h-32 border rounded flex items-center justify-center bg-muted group">
                  <div className="text-sm text-center px-2 truncate">
                    {pdfs[0].name}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}
                    className="absolute top-1 right-1 bg-white/90 hover:bg-white rounded-full p-1 shadow"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}

              {pdfs.length === 0 && (
                <Label className="cursor-pointer w-32 h-32 border-dashed border-2 border-muted-foreground/50 rounded flex items-center justify-center bg-muted">
                  <Input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={onDrop}
                  />
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </Label>
              )}
            </div>
          )}
        />
        {errors.pdf && (
          <p className="text-sm text-red-500 mt-2">
            {errors.pdf.message}
          </p>
        )}
      </form>
      <div className="flex justify-end">
        <Button
          variant="outline"
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={pdfs.length === 0}
        >
          Submit For Review
        </Button>
      </div>
    </>
  );
};

export default UploadPdf;
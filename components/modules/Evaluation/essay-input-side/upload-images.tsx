/* eslint-disable @next/next/no-img-element */
/**
 * UploadImages component for handling image uploads with drag-and-drop functionality.
 *
 * @component
 * @description Allows users to upload, reorder, and submit multiple images with validation
 * - Supports up to 15 images
 * - Validates image types (JPEG, PNG, JPG)
 * - Provides drag-and-drop reordering of images
 * - Prevents duplicate image uploads
 *
 * @returns {React.ReactElement} A form for image upload with submit button
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Plus, GripVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { useAIEvaluation } from "@/hooks/use-ai-evaluation";
import EditUploadedEssayText from "./edit-uploaded-essay-text";
import { Skeleton } from "@/components/ui/skeleton";

// Accepted image types
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

// Maximum number of images
const maxImagesQuantity = 15;

const formSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(maxImagesQuantity, `Maximum of ${maxImagesQuantity} images allowed`),
});

type FormValues = z.infer<typeof formSchema>;

// Sortable image component
type SortableImageProps = {
  file: File;
  index: number;
  preview: string;
  onRemove: (index: number) => void;
};

// Memoized SortableImage component
const SortableImage = React.memo(function SortableImage({
  file,
  index,
  preview,
  onRemove,
}: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-32 h-32 rounded overflow-hidden border bg-muted group"
    >
      <img
        src={preview}
        alt={`upload-${index}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        className="absolute top-1 right-1 bg-white/90 hover:bg-white rounded-full p-1 shadow z-10"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-1 left-1 bg-white rounded-full p-1 shadow cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical className="w-4 h-4" />
      </div>
    </div>
  );
});

// Memoized image previews
const useImagePreviews = (images: File[]) => {
  return useMemo(() => {
    return images.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
  }, [images]);
};

// UploadImages component
const UploadImages = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { images: [] },
  });

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  const images = watch("images");
  const imagePreviews = useImagePreviews(images);

  const { uploadImages } = useAIEvaluation();

  // Handle form submission - Call the API and get the extracted text from the API for show back to the user
  const onSubmit = (data: FormValues) => {
    console.log("Submitted Images:", data.images);
    uploadImages.mutate(images);
  };

  // Handle image upload
  const onDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const existing = watch("images");

    // Filter out duplicate files
    const filtered = newFiles.filter((file) => {
      const isAllowedType = ACCEPTED_IMAGE_TYPES.includes(file.type);
      const isDuplicate = existing.some(
        (f) => f.name === file.name && f.size === file.size
      );

      if (!isAllowedType) {
        toast.error("Invalid file type");
      }
      if (isDuplicate) {
        toast.error("Same File already added");
      }

      return isAllowedType && !isDuplicate;
    });

    // Check if the total number of files is greater than maxImagesQuantity
    if (filtered.length + existing.length > maxImagesQuantity) {
      toast.error("Cannot upload more than maxImagesQuantity images.");
      return;
    }

    setValue("images", [...existing, ...filtered]);
    e.target.value = "";
  };

  // Handle image removal from the uploaded images
  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue("images", newImages);
  };

  // Handle image drag and drop
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((f) => f.name === active.id);
      const newIndex = images.findIndex((f) => f.name === over?.id);
      const newArr = arrayMove(images, oldIndex, newIndex);
      setValue("images", newArr);
    }
  };
  if (!uploadImages.isError && uploadImages.isIdle) {
    return (
      <>
        <form
          // onSubmit={handleSubmit(onSubmit)}
          className="border rounded-md bg-card h-[70vh] p-4 flex flex-col gap-4"
        >
          <Label className="text-lg font-semibold">Upload Images</Label>
          <p className="text-sm text-muted-foreground -mt-2">
            Drag and drop to change sequence. Max {maxImagesQuantity} images
            allowed.
          </p>

          <Controller
            control={control}
            name="images"
            render={() => (
              <>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={images.map((file) => file.name)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-wrap gap-4">
                      {imagePreviews.map(({ file, preview }, index) => (
                        <SortableImage
                          key={file.name}
                          file={file}
                          index={index}
                          preview={preview}
                          onRemove={handleRemove}
                        />
                      ))}

                      {images.length < maxImagesQuantity && (
                        <Label className="cursor-pointer w-32 h-32 border-dashed border-2 border-muted-foreground/50 rounded flex items-center justify-center bg-muted">
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            multiple
                            onChange={onDrop}
                          />
                          <Plus className="w-6 h-6 text-muted-foreground" />
                        </Label>
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
                {errors.images && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.images.message}
                  </p>
                )}
              </>
            )}
          />
        </form>
        <div className="flex justify-end">
          <Button
            variant="outline"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={images.length === 0}
          >
            Submit For Review
          </Button>
        </div>
      </>
    );
  } else if (uploadImages.isPending) {
    return (
      <>
        <Skeleton className="h-[70vh]"></Skeleton>
        <div className="flex justify-end">
          <Button variant="outline" type="submit" disabled>
            <Loader2 className="animate-spin mr-2" />
            Submit For Review
          </Button>
        </div>
      </>
    );
  } else if (uploadImages.isSuccess) {
    return (
      <EditUploadedEssayText
        uploadType="upload-images"
        extractedText={uploadImages.data.extractedText}
        wordCount={uploadImages.data.wordCount}
      />
    );
  }
};

export default UploadImages;

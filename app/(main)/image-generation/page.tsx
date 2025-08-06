"use client";

import AiInput from "@/components/ui/ai-input";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import axios from "axios";
import { useMutation, useQuery } from "convex/react";
import { Download, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type ImageType = {
  _id: string;
  url: string;
  clerkId: string;
};

export default function ImageGeneration() {
  const images = useQuery(api.images.getImages);
  const imageGenerations = useQuery(api.images.getImageGenerations);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());

  // Mutations
  const deleteImageGeneration = useMutation(api.images.deleteImageGeneration);

  const handleDownload = (imageUrl: string, prompt: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `generated-image-${prompt.slice(0, 20)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCancel = async (imageId: string) => {
    try {
      const promise = axios.post("/api/cancel/image", { imageId });
      toast.promise(promise, {
        loading: "Canceling image generation...",
        success: "Image generation cancelled",
        error: "Failed to cancel image generation",
      });
    } catch (error) {
      console.error("Error canceling image generation:", error);
      toast.error("Failed to cancel image generation");
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      setDeletingImages((prev) => new Set(prev).add(imageId));
      const promise = deleteImageGeneration({ imageId: imageId as any });
      toast.promise(promise, {
        loading: "Deleting image generation...",
        success: "Image generation deleted",
        error: "Failed to delete image generation",
      });
    } catch (error) {
      console.error("Error deleting image generation:", error);
      toast.error("Failed to delete image generation");
    } finally {
      setDeletingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const handleImageClick = (image: ImageType) => {
    // If the clicked image is already selected, unselect it
    if (selectedImage && selectedImage._id === image._id) {
      setSelectedImage(null);
    } else {
      // Otherwise, select the clicked image
      setSelectedImage(image);
    }
  };

  const handleGeneratedImageClick = (generation: any) => {
    // Convert generation to ImageType format
    const imageData: ImageType = {
      _id: generation._id,
      url: generation.image || "",
      clerkId: generation.clerkId,
    };

    // If the clicked image is already selected, unselect it
    if (selectedImage && selectedImage._id === generation._id) {
      setSelectedImage(null);
    } else {
      // Otherwise, select the clicked image
      setSelectedImage(imageData);
    }
  };

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Carousel replacing the grid */}
      <Carousel className="mx-12">
        <CarouselContent>
          {images
            ? images.map((image) => (
                <CarouselItem
                  key={image._id}
                  className="flex justify-center basis-auto"
                >
                  <div
                    onClick={() => handleImageClick(image)}
                    className={`cursor-pointer border-2 rounded-md transition ${
                      selectedImage && selectedImage._id === image._id
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image.url}
                      className="h-[200px] w-auto rounded-md"
                      alt="Image"
                      width={300}
                      height={200}
                    />
                  </div>
                </CarouselItem>
              ))
            : // Skeleton loading for carousel
              Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="flex justify-center basis-auto"
                >
                  <div className="cursor-pointer border-2 rounded-md transition border-transparent">
                    <Skeleton className="h-[200px] w-[300px] rounded-md" />
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="w-full">
        <AiInput selectedImage={selectedImage} />
      </div>

      {/* Image Generations Masonry Gallery */}
      {imageGenerations ? (
        imageGenerations.length > 0 ? (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Generated Images</h3>
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 space-y-3">
              {imageGenerations.map((generation) => (
                <div
                  key={generation._id}
                  className="break-inside-avoid mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 relative"
                >
                  {/* Status-based content */}
                  {generation.status === "PROCESSING" ||
                  generation.status === "QUEUED" ? (
                    // Skeleton loading UI for processing/queued
                    <div
                      className={`relative overflow-hidden group ${
                        generation.type === "LOGO"
                          ? "aspect-square"
                          : "aspect-video"
                      }`}
                    >
                      <Skeleton
                        className={`w-full ${
                          generation.type === "LOGO"
                            ? "aspect-square"
                            : "aspect-video"
                        }`}
                      />

                      {/* Cancel button */}
                      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancel(generation._id)}
                          className="h-8 w-8 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 backdrop-blur-sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Status text */}
                      <div className="absolute bottom-2 left-2 z-10">
                        <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-medium">
                          {generation.status === "PROCESSING"
                            ? "PROCESSING"
                            : "Queued"}
                        </div>
                      </div>
                    </div>
                  ) : generation.status === "COMPLETED" ? (
                    // Completed image with download button
                    <div
                      className={`relative group cursor-pointer border-2 rounded-md transition ${
                        selectedImage && selectedImage._id === generation._id
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                      onClick={() => handleGeneratedImageClick(generation)}
                    >
                      <Image
                        src={generation.image || ""}
                        alt="Generated Image"
                        width={400}
                        height={400}
                        className={`w-full h-auto object-cover ${
                          generation.type === "LOGO"
                            ? "aspect-square"
                            : "aspect-video"
                        }`}
                      />

                      {/* Skeleton effect when deleting */}
                      {deletingImages.has(generation._id) && (
                        <div className="absolute inset-0 pointer-events-none">
                          <Skeleton className="w-full h-full rounded-none" />
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* Download button */}
                        <Button
                          size="sm"
                          onClick={() =>
                            handleDownload(
                              generation.image || "",
                              generation.prompt
                            )
                          }
                          className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm shadow-lg"
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        {/* Delete button */}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(generation._id)}
                          className="h-8 w-8 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 backdrop-blur-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Prompt overlay on hover */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-white text-xs truncate">
                          {generation.prompt}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Failed state with delete button
                    <div
                      className={`relative bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 overflow-hidden group ${
                        generation.type === "LOGO"
                          ? "aspect-square"
                          : "aspect-video"
                      }`}
                    >
                      {/* Failed state background */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                            <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                          </div>
                          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                            Generation Failed
                          </p>
                        </div>
                      </div>

                      {/* Skeleton effect when deleting */}
                      {deletingImages.has(generation._id) && (
                        <div className="absolute inset-0 pointer-events-none">
                          <Skeleton className="w-full h-full rounded-none" />
                        </div>
                      )}

                      {/* Delete button */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(generation._id)}
                          className="h-8 w-8 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 backdrop-blur-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Failed status */}
                      <div className="absolute bottom-2 left-2">
                        <div className="bg-red-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-medium">
                          Failed
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Empty state when no images
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Generated Images</h3>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No generated images yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start generating images to see them here.
              </p>
            </div>
          </div>
        )
      ) : (
        // Loading skeleton UI
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-4">Generated Images</h3>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 space-y-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="break-inside-avoid mb-3 rounded-lg overflow-hidden shadow-md relative"
              >
                <div className="relative">
                  <Skeleton className="aspect-video w-full" />

                  {/* Skeleton content overlays */}
                  <div className="absolute inset-0 flex flex-col justify-between p-3">
                    {/* Top section - placeholder for buttons */}
                    <div className="flex justify-end">
                      <Skeleton className="w-8 h-8 rounded-full" />
                    </div>

                    {/* Bottom section - placeholder for status */}
                    <div className="flex justify-start">
                      <Skeleton className="w-16 h-6 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

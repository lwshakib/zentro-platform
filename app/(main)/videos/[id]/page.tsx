"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import axios from "axios";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Loader2,
  Mic,
  Palette,
  Play,
  Trash2,
  Type,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import RemotionPlayer from "../../_components/remotion-player";

type Props = {};

function page({}: Props) {
  const params = useParams();
  const router = useRouter();

  const videoData = useQuery(api.videos.getVideo, {
    videoId: params?.id as any,
  });

  const deleteVideo = useMutation(api.videos.deleteVideo);

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  // Download handler
  const handleDownload = () => {
    if (videoData?.videoUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = videoData.videoUrl;
      link.download = `${videoData.title || "video"}.mp4`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error("Video not available for download");
    }
  };

  // Delete video handler
  const handleDeleteVideo = async () => {
    if (!videoData?._id) return;

    try {
      const promise = deleteVideo({ videoId: videoData._id });

      toast.promise(promise, {
        loading: "Deleting video...",
        success: "Video deleted successfully!",
        error: "Failed to delete video",
      });
      router.push("/videos");
      await promise;
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  // Cancel video handler
  const handleCancelVideo = async () => {
    if (!videoData?._id) return;

    try {
      const promise = axios.post("/api/cancel/video", {
        videoId: videoData._id,
      });

      toast.promise(promise, {
        loading: "Cancelling video...",
        success: "Video cancelled successfully!",
        error: "Failed to cancel video",
      });
      await promise;
      router.push("/videos");
    } catch (error) {
      console.error("Error cancelling video:", error);
      toast.error("Failed to cancel video");
    }
  };

  // Render video handler
  const handleRenderVideo = async () => {
    if (!videoData?._id) return;

    try {
      const promise = axios.post("/api/create/render", {
        videoId: videoData._id,
      });

      toast.promise(promise, {
        loading: "Starting video rendering...",
        success: "Video rendering started!",
        error: "Failed to start video rendering",
      });
      await promise;
    } catch (error) {
      console.error("Error rendering video:", error);
      toast.error("Failed to start video rendering");
    }
  };

  // Loading state
  const loading = videoData === undefined;
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 p-2 sm:p-4 md:p-8 w-full h-full max-w-full overflow-x-hidden">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-[360px] aspect-[9/16] relative bg-gray-100 dark:bg-zinc-800 overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-700">
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/40 to-transparent dark:via-white/20 animate-shimmer"></div>

            {/* Bottom info skeleton */}
            <div className="absolute bottom-0 left-0 w-full p-4">
              <div className="h-4 w-3/4 bg-gray-300 dark:bg-zinc-600 rounded animate-pulse mb-2"></div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 dark:bg-zinc-600 rounded-full animate-pulse mr-2"></div>
                <div className="h-3 w-16 bg-gray-300 dark:bg-zinc-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 bg-white dark:bg-zinc-900 rounded-xl p-6 justify-between shadow-lg border border-gray-200 dark:border-zinc-800 min-h-[400px]">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full mt-6" />
        </div>
      </div>
    );
  }

  // Content Not Found state
  if (!videoData || Object.keys(videoData).length === 0) {
    return (
      <div className="col-span-2 flex flex-col items-center justify-center py-20">
        <XCircle className="text-red-500 mb-2" size={48} />
        <div className="text-red-400 font-semibold text-xl mb-2 italic">
          Content not found
        </div>
        <div className="text-zinc-400 mb-4">
          The video you're looking for doesn't exist or has been removed.
        </div>
        <Link
          href="/videos"
          className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition"
          aria-label="Back to Videos"
        >
          Back to Videos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 p-2 sm:p-4 md:p-8 w-full h-full max-w-full overflow-x-hidden">
      <div className="flex flex-col justify-center items-center gap-4">
        {videoData.status === "COMPLETED" ? (
          <div className="w-full max-w-[360px] aspect-[9/16] flex justify-center">
            <RemotionPlayer videoData={videoData} />
          </div>
        ) : videoData.status === "PROCESSING" ||
          videoData.status === "QUEUED" ? (
          <div className="w-full max-w-[360px] aspect-[9/16] relative bg-gray-100 dark:bg-zinc-800 overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-700">
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/40 to-transparent dark:via-white/20 animate-shimmer"></div>

            {/* Bottom info skeleton */}
            <div className="absolute bottom-0 left-0 w-full p-4">
              <div className="h-4 w-3/4 bg-gray-300 dark:bg-zinc-600 rounded animate-pulse mb-2"></div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 dark:bg-zinc-600 rounded-full animate-pulse mr-2"></div>
                <div className="h-3 w-16 bg-gray-300 dark:bg-zinc-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : videoData.status === "FAILED" ? (
          <div className="w-full max-w-[360px] aspect-[9/16] flex items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400">
            <div className="text-center">
              <XCircle className="text-red-500 mb-2 mx-auto" size={48} />
              <div className="text-red-600 dark:text-red-400 font-semibold text-lg mb-2">
                Video Generation Failed
              </div>
              <div className="text-gray-600 dark:text-zinc-400 text-sm">
                Something went wrong during video generation.
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[360px] aspect-[9/16] flex items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400">
            No preview available
          </div>
        )}
      </div>

      <div className="w-full h-full">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 w-full h-auto rounded-xl p-4 sm:p-6 md:p-8 m-2 sm:m-4 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Link
                href="/videos"
                className="flex items-center text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white gap-2 group max-w-full sm:max-w-xs"
                aria-label="Back to Videos"
              >
                <ArrowLeft className="transition group-hover:-translate-x-1" />
                <span className="hidden sm:inline-block">Back to Videos</span>
              </Link>
            </div>

            {/* Video Title */}
            <div className="flex items-center gap-2 mb-2">
              <FileText
                className="text-gray-500 dark:text-zinc-400"
                size={18}
              />
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                {videoData?.title || (
                  <span className="italic">Content not found</span>
                )}
              </div>
            </div>

            {/* Video Style */}
            <div className="flex items-center gap-2 mb-2">
              <Palette className="text-gray-500 dark:text-zinc-400" size={18} />
              <span className="font-medium text-gray-900 dark:text-white">
                {videoData?.videoStyle || (
                  <span className="italic">Content not found</span>
                )}
              </span>
            </div>

            {/* Voice */}
            <div className="flex items-center gap-2 mb-2">
              <Mic className="text-gray-500 dark:text-zinc-400" size={18} />
              <span className="font-medium text-gray-900 dark:text-white">
                {videoData?.voice || (
                  <span className="italic">Content not found</span>
                )}
              </span>
            </div>

            {/* Caption Style */}
            <div className="flex items-center gap-2 mb-2">
              <Type className="text-gray-500 dark:text-zinc-400" size={18} />
              <span className="font-medium text-gray-900 dark:text-white">
                {videoData?.captionStyle?.label || (
                  <span className="italic">Content not found</span>
                )}
              </span>
            </div>

            {/* Topic */}
            <div className="flex items-center gap-2 mb-2">
              <FileText
                className="text-gray-500 dark:text-zinc-400"
                size={18}
              />
              <span className="font-medium text-gray-900 dark:text-white">
                Topic:{" "}
                {videoData?.topic || (
                  <span className="italic">Content not found</span>
                )}
              </span>
            </div>

            {/* Creation Date */}
            <div className="flex items-center gap-4 mb-2">
              <Calendar
                className="text-gray-500 dark:text-zinc-400"
                size={16}
              />
              <span className="text-gray-600 dark:text-zinc-300 text-sm">
                Created: {formatDate(videoData?.updatedAt)}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  videoData.status === "COMPLETED"
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : videoData.status === "PROCESSING"
                      ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      : videoData.status === "QUEUED"
                        ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                        : "bg-red-500/20 text-red-600 dark:text-red-400"
                }`}
              >
                {videoData.status}
              </div>
            </div>

            {/* Script */}
            <div className="flex items-start gap-2 mb-4">
              <div className="text-gray-700 dark:text-zinc-200 text-sm whitespace-pre-line">
                <span className="font-semibold">Script:</span>{" "}
                {videoData?.script || (
                  <span className="italic">Content not found</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-6">
            {videoData.status === "COMPLETED" && (
              <>
                {videoData.rendering === "RENDERED" ? (
                  <Button
                    className="w-full flex items-center justify-center gap-2 text-base sm:text-lg"
                    variant="outline"
                    onClick={handleDownload}
                    aria-label="Export and Download Video"
                  >
                    <Download />
                    Export & Download
                  </Button>
                ) : videoData.rendering === "NOT_RENDERED" ? (
                  <Button
                    className="w-full flex items-center justify-center gap-2 text-base sm:text-lg"
                    onClick={handleRenderVideo}
                    aria-label="Render Video"
                  >
                    <Play />
                    Render Video
                  </Button>
                ) : videoData.rendering === "RENDERING" ? (
                  <Button
                    className="w-full flex items-center justify-center gap-2 text-base sm:text-lg"
                    variant="outline"
                    disabled
                    aria-label="Rendering Video"
                  >
                    <Loader2 className="animate-spin" />
                    Rendering Video...
                  </Button>
                ) : (
                  <Button
                    className="w-full flex items-center justify-center gap-2 text-base sm:text-lg"
                    variant="outline"
                    onClick={handleDownload}
                    aria-label="Export and Download Video"
                  >
                    <Download />
                    Export & Download
                  </Button>
                )}
                <Button
                  className="w-full flex items-center justify-center gap-2 text-base sm:text-lg"
                  variant="destructive"
                  onClick={handleDeleteVideo}
                  aria-label="Delete Video"
                >
                  <Trash2 />
                  Delete Video
                </Button>
              </>
            )}

            {(videoData.status === "PROCESSING" ||
              videoData.status === "QUEUED") && (
              <Button
                className="w-full flex items-center justify-center gap-2 text-base sm:text-lg"
                variant="destructive"
                onClick={handleCancelVideo}
                aria-label="Cancel Video Generation"
              >
                <X />
                Cancel Generation
              </Button>
            )}

            {videoData.status === "FAILED" && (
              <Button
                className="w-full flex items-center justify-center gap-2 text-base sm:text-lg"
                variant="destructive"
                onClick={handleDeleteVideo}
                aria-label="Delete Failed Video"
              >
                <Trash2 />
                Delete Video
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;

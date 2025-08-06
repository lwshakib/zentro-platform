"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  captionStyles,
  suggestions,
  videoStyles,
  videoVoices,
} from "@/constants/data";
import { api } from "@/convex/_generated/api";
import { Protect, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Plus, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {};

interface Video {
  _id: string;
  title?: string;
  image: string;
  updatedAt: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
}

function Page({}: Props) {
  const router = useRouter();

  const { user } = useUser();
  const videos = useQuery(api.videos.getVideos);
  const loading = videos === undefined;
  const error = null; // Convex useQuery handles errors internally
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Video topic selection state
  const [selectedTab, setSelectedTab] = useState("suggestions");
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const [customTopic, setCustomTopic] = useState("");
  const [scriptLoading, setScriptLoading] = useState(false);
  const [generatedScripts, setGeneratedScripts] = useState<
    Array<{ content: string }>
  >([]);
  const [selectedScriptIdx, setSelectedScriptIdx] = useState<number | null>(
    null
  );
  const [selectedStyle, setSelectedStyle] = useState<string>("Anime");
  const [selectedVoice, setSelectedVoice] = useState<string>("Thalia");
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState<{
    label: string;
    className: string;
  } | null>(null);

  const selectedTopic = selectedSuggestion || customTopic;

  const handleGenerateScript = async () => {
    if (!selectedTopic) return;

    setScriptLoading(true);

    try {
      const response = axios.post("/api/scripts", {
        topic: selectedTopic,
      });

      toast.promise(response, {
        loading: "Generating script...",
        success: "Script generated successfully",
        error: "Failed to generate script",
      });

      const { data } = await response;
      setGeneratedScripts(data.data.scripts || []);
    } catch (error) {
      console.error("Error generating script:", error);
      toast.error("Failed to generate script");
    } finally {
      setScriptLoading(false);
    }
  };

  const createVideo = useMutation(api.videos.createVideo);

  const handleCreateVideo = async () => {
    if (
      !user?.id ||
      selectedScriptIdx === null ||
      !selectedStyle ||
      !selectedVoice ||
      !selectedCaptionStyle
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Find the selected voice to get the Model
      const selectedVoiceData = videoVoices.find(
        (voice) => voice.Id === selectedVoice
      );
      if (!selectedVoiceData) {
        toast.error("Invalid voice selection");
        return;
      }

      const videoData = {
        clerkId: user.id,
        script: generatedScripts[selectedScriptIdx!].content,
        topic: selectedTopic,
        captionStyle: selectedCaptionStyle,
        videoStyle: selectedStyle,
        voice: selectedVoiceData.Model, // Use the Model instead of Id
        status: "QUEUED",
        updatedAt: new Date().toISOString(),
        rendering: "NOT_RENDERED",
        // No title provided as requested
      };
      setIsCreateDialogOpen(false);

      const promise = (async () => {
        const videoId = await createVideo(videoData);
        await axios.post("/api/create/video", {
          videoId,
        });
      })();

      toast.promise(promise, {
        loading: "Creating video...",
        success: "Video created successfully!",
        error: "Failed to create video",
      });

      // Reset form
      setSelectedSuggestion(null);
      setCustomTopic("");
      setGeneratedScripts([]);
      setSelectedScriptIdx(null);
      setSelectedStyle("Anime");
      setSelectedVoice("Thalia");
      setSelectedCaptionStyle(null);
    } catch (error) {
      console.error("Error creating video:", error);
      toast.error("Failed to create video");
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Videos
            </h1>
            <p className="text-gray-600 dark:text-zinc-400 text-sm sm:text-base">
              Manage and view your generated videos
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <Protect
              plan={"pro"}
              fallback={
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Video
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You can't create videos without a Pro subscription</p>
                  </TooltipContent>
                </Tooltip>
              }
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Video
                </Button>
              </DialogTrigger>
            </Protect>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
              <ScrollArea className="h-[80vh] pr-4">
                <DialogHeader>
                  <DialogTitle>Create New Video</DialogTitle>
                  <DialogDescription>
                    Start creating a new video with our AI-powered platform.
                    Choose your topic and we'll generate a professional script
                    for you.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <h2 className="text-2xl font-semibold mb-1 mt-4">
                    Video Topic
                  </h2>
                  <p className="mb-4 text-muted-foreground text-sm">
                    Choose a topic for your video. You can select from
                    suggestions or enter your own custom topic to guide the
                    script generation.
                  </p>
                  <Tabs
                    defaultValue="suggestions"
                    value={selectedTab}
                    onValueChange={setSelectedTab}
                    className="mb-6 w-full max-w-xl"
                  >
                    <TabsList>
                      <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                      <TabsTrigger value="your-topic">Your Topic</TabsTrigger>
                    </TabsList>
                    <TabsContent value="suggestions">
                      <div className="flex gap-2 flex-wrap mt-4">
                        {suggestions.map((s) => (
                          <Button
                            key={s}
                            variant={
                              selectedSuggestion === s ? "default" : "outline"
                            }
                            onClick={() => {
                              setSelectedSuggestion(s);
                              setCustomTopic("");
                            }}
                          >
                            {s}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="your-topic">
                      <div className="mt-4">
                        <Input
                          placeholder="Enter your topic"
                          value={customTopic}
                          onChange={(e) => {
                            setCustomTopic(e.target.value);
                            setSelectedSuggestion(null);
                          }}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <Button
                    className="mt-4"
                    size="lg"
                    onClick={handleGenerateScript}
                    disabled={!selectedTopic || scriptLoading}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    {scriptLoading ? "Generating..." : "Generate Script"}
                  </Button>

                  <div className="mt-6 min-h-[60px]">
                    {scriptLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-5/6 mb-2" />
                        <Skeleton className="h-6 w-2/3" />
                      </div>
                    ) : generatedScripts.length > 0 ? (
                      <div className="space-y-3">
                        {generatedScripts.map((script, idx) => (
                          <Card
                            key={idx}
                            className={`p-4 cursor-pointer transition-all border-2 ${
                              selectedScriptIdx === idx
                                ? "border-primary ring-2 ring-primary"
                                : "border-transparent hover:border-primary/40"
                            }`}
                            onClick={() => setSelectedScriptIdx(idx)}
                          >
                            <div className="whitespace-pre-line text-sm">
                              {script.content}
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-1">Video Styles</h3>
                    <p className="mb-4 text-muted-foreground text-sm">
                      Pick a visual style for your video. This will influence
                      the look and feel of the generated content. Scroll to see
                      all available styles.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {videoStyles.map((style) => (
                        <div
                          key={style.label}
                          className={`cursor-pointer rounded-lg border-2 p-2 flex flex-col items-center transition-all duration-150 ${
                            selectedStyle === style.label
                              ? "border-primary ring-2 ring-primary"
                              : "border-transparent hover:border-primary/40"
                          } cursor-pointer`}
                          onClick={() => setSelectedStyle(style.label)}
                        >
                          <img
                            src={style.src}
                            alt={style.label}
                            className="w-28 h-28 object-cover rounded-md mb-2"
                            style={{
                              boxShadow:
                                selectedStyle === style.label
                                  ? "0 0 0 2px var(--tw-ring-color)"
                                  : undefined,
                            }}
                          />
                          <span className="font-medium text-center">
                            {style.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-1">Video Voice</h3>
                    <p className="mb-4 text-muted-foreground text-sm">
                      Select a voice style for your video narration.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {videoVoices.map((voice) => (
                        <button
                          key={voice.Id}
                          type="button"
                          className={`px-5 py-2 rounded-lg font-medium transition-all duration-150 bg-background border-2 focus:outline-none ${
                            selectedVoice === voice.Id
                              ? "border-primary ring-2 ring-primary"
                              : "border-muted hover:border-primary/40"
                          } cursor-pointer`}
                          onClick={() => setSelectedVoice(voice.Id)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-semibold">{voice.Name}</span>
                            <span className="text-xs text-muted-foreground">
                              {voice.Gender} • {voice.LanguageName}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {voice.Description}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-1">
                      Caption Style
                    </h3>
                    <p className="mb-4 text-muted-foreground text-sm">
                      Select Caption Style
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {captionStyles.map((style) => (
                        <button
                          key={style.label}
                          type="button"
                          className={`px-7 py-4 rounded-lg text-2xl transition-all duration-150 font-sans bg-[#151A23] focus:outline-none ${
                            style.className
                          } ${
                            selectedCaptionStyle?.label === style.label
                              ? "ring-2 ring-primary border-primary border-2"
                              : "border-2 border-transparent hover:border-primary/40"
                          } cursor-pointer`}
                          onClick={() => setSelectedCaptionStyle(style)}
                          style={{ minWidth: 120 }}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  {generatedScripts.length > 0 &&
                    selectedScriptIdx !== null &&
                    selectedStyle &&
                    selectedVoice &&
                    selectedCaptionStyle && (
                      <Button onClick={handleCreateVideo}>
                        Generate Video
                      </Button>
                    )}
                </DialogFooter>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading state */}
        {!videos && (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 dark:border-zinc-800/50"
              >
                <div className="aspect-[9/16] relative">
                  {/* Video thumbnail skeleton */}
                  <Skeleton className="w-full h-full rounded-none" />

                  {/* Status badge skeleton */}
                  <div className="absolute top-3 right-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>

                  {/* Card info overlay skeleton */}
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
                Error Loading Videos
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Something went wrong loading videos
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Videos grid */}
        {!loading && !error && (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {videos &&
              videos.length > 0 &&
              videos.map((video: any) => (
                <div
                  key={video._id}
                  className="group relative bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-50/90 dark:hover:bg-zinc-800/60 border border-gray-200/50 dark:border-zinc-800/50 hover:border-gray-300/50 dark:hover:border-zinc-700/50 cursor-pointer"
                  onClick={() => router.push(`/videos/${video._id}`)}
                >
                  {video.status === "PROCESSING" ||
                  video.status === "QUEUED" ? (
                    <div className="aspect-[9/16] relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden">
                      {/* Shimmer effect overlay - visible in both light and dark themes */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/40 to-transparent dark:via-white/20 animate-shimmer"></div>

                      {/* Bottom info skeleton */}
                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <div className="h-4 w-3/4 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-zinc-600 dark:to-zinc-700 rounded animate-pulse mb-2"></div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-zinc-600 dark:to-zinc-700 rounded-full animate-pulse mr-2"></div>
                          <div className="h-3 w-16 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-zinc-600 dark:to-zinc-700 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[9/16] relative group">
                      <Image
                        src={video.image}
                        alt={video.title || "Video"}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        width={720}
                        height={1280}
                      />

                      {/* Gradient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Card info overlay */}
                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <div className="text-sm font-semibold text-white text-left truncate mb-1">
                          {video.title}
                        </div>
                        <div className="text-xs text-zinc-300 text-left flex items-center">
                          <span>
                            {formatDistanceToNow(video.updatedAt)} ago
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Empty state (when no videos) */}
        {!loading && !error && videos && videos.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                You haven't created any Video yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start creating your first video to get started.
              </p>
              <Protect
                plan={"pro"}
                fallback={
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className=" text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                        Create Your First Video
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You can't create videos without a Pro subscription</p>
                    </TooltipContent>
                  </Tooltip>
                }
              >
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className=" text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Create Your First Video
                </Button>
              </Protect>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;

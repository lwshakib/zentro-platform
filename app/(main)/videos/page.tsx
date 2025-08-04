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
import { formatDistanceToNow } from "date-fns";
import { Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {};

interface Video {
  id: string;
  clerkId: string;
  audioUrl: string | null;
  captionStyle: string;
  captions: any[] | null;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
  script: string;
  title: string;
  videoProgress: "PENDING" | "COMPLETED";
  videoStyle: string;
  voice: string;
}

// Dummy data
const dummyVideos: Video[] = [
  {
    id: "1",
    clerkId: "user_123",
    audioUrl: null,
    captionStyle: "modern",
    captions: null,
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
    images: [
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=600&fit=crop",
    ],
    script: "Amazing video about AI technology...",
    title: "The Future of AI Technology",
    videoProgress: "COMPLETED",
    videoStyle: "modern",
    voice: "male",
  },
  {
    id: "2",
    clerkId: "user_123",
    audioUrl: null,
    captionStyle: "vintage",
    captions: null,
    createdAt: new Date("2024-01-14T15:45:00Z"),
    updatedAt: new Date("2024-01-14T15:45:00Z"),
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    ],
    script: "Exploring the depths of space...",
    title: "Space Exploration Journey",
    videoProgress: "COMPLETED",
    videoStyle: "cinematic",
    voice: "female",
  },
  {
    id: "3",
    clerkId: "user_123",
    audioUrl: null,
    captionStyle: "minimal",
    captions: null,
    createdAt: new Date("2024-01-13T09:20:00Z"),
    updatedAt: new Date("2024-01-13T09:20:00Z"),
    images: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=600&fit=crop",
    ],
    script: "Digital transformation in business...",
    title: "Digital Transformation Guide",
    videoProgress: "PENDING",
    videoStyle: "corporate",
    voice: "male",
  },
  {
    id: "4",
    clerkId: "user_123",
    audioUrl: null,
    captionStyle: "bold",
    captions: null,
    createdAt: new Date("2024-01-12T14:15:00Z"),
    updatedAt: new Date("2024-01-12T14:15:00Z"),
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop",
    ],
    script: "Understanding market trends...",
    title: "Market Analysis 2024",
    videoProgress: "COMPLETED",
    videoStyle: "analytical",
    voice: "female",
  },
  {
    id: "5",
    clerkId: "user_123",
    audioUrl: null,
    captionStyle: "elegant",
    captions: null,
    createdAt: new Date("2024-01-11T11:30:00Z"),
    updatedAt: new Date("2024-01-11T11:30:00Z"),
    images: [
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=600&fit=crop",
    ],
    script: "Innovation in modern workplaces...",
    title: "Workplace Innovation",
    videoProgress: "COMPLETED",
    videoStyle: "modern",
    voice: "male",
  },
  {
    id: "6",
    clerkId: "user_123",
    audioUrl: null,
    captionStyle: "dynamic",
    captions: null,
    createdAt: new Date("2024-01-10T16:00:00Z"),
    updatedAt: new Date("2024-01-10T16:00:00Z"),
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=600&fit=crop",
    ],
    script: "Building effective teams...",
    title: "Team Building Strategies",
    videoProgress: "PENDING",
    videoStyle: "collaborative",
    voice: "female",
  },
];

function Page({}: Props) {
  const router = useRouter();
  const loading = false; // Set to true to show loading state
  const error: { message: string } | null = null; // Set to error object to show error state
  const videos = dummyVideos; // Use dummy data
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
  const [selectedStyle, setSelectedStyle] = useState<string>("Modern");

  const suggestions = [
    "AI Technology Trends",
    "Digital Marketing Strategies",
    "Remote Work Best Practices",
    "Sustainable Business",
    "Customer Experience",
    "Innovation in Tech",
    "Leadership Skills",
    "Product Development",
  ];

  const videoStyles = [
    {
      label: "Modern",
      src: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=200&fit=crop",
    },
    {
      label: "Cinematic",
      src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop",
    },
    {
      label: "Corporate",
      src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200&fit=crop",
    },
    {
      label: "Analytical",
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop",
    },
    {
      label: "Collaborative",
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop",
    },
    {
      label: "Vintage",
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
    },
  ];

  const selectedTopic = selectedSuggestion || customTopic;

  const handleGenerateScript = () => {
    if (!selectedTopic) return;
    setScriptLoading(true);
    // Simulate script generation with dummy scripts
    setTimeout(() => {
      setScriptLoading(false);
      setGeneratedScripts([
        {
          content:
            "Welcome to our comprehensive guide on AI Technology Trends. In this video, we'll explore the latest developments in artificial intelligence and how they're reshaping industries worldwide. From machine learning breakthroughs to practical applications, we'll cover everything you need to know about the future of AI.",
        },
        {
          content:
            "Discover the cutting-edge world of artificial intelligence in our latest video. We'll dive deep into emerging AI technologies, their real-world applications, and what this means for businesses and individuals alike. Join us as we explore the fascinating landscape of AI innovation.",
        },
        {
          content:
            "Artificial Intelligence is revolutionizing how we work and live. In this engaging video, we'll examine the most significant AI trends of 2024, from generative AI to autonomous systems. Learn how these technologies are creating new opportunities and transforming traditional industries.",
        },
      ]);
    }, 2000);
  };

  const handleCreateVideo = () => {
    setIsCreateDialogOpen(false);
    router.push("/create-video");
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
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Video
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Create New Video</DialogTitle>
                <DialogDescription>
                  Start creating a new video with our AI-powered platform.
                  Choose your topic and we'll generate a professional script for
                  you.
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="h-[60vh] pr-4">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                            <div className="whitespace-pre-line text-xs">
                              {script.content}
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {generatedScripts.length > 0 &&
                    selectedScriptIdx !== null && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-1">
                          Video Styles
                        </h3>
                        <p className="mb-4 text-muted-foreground text-sm">
                          Pick a visual style for your video. This will
                          influence the look and feel of the generated content.
                          Scroll to see all available styles.
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
                    )}
                </div>
              </ScrollArea>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                {generatedScripts.length > 0 && selectedScriptIdx !== null && (
                  <Button onClick={handleCreateVideo}>Use This Script</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="group relative bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 dark:border-zinc-800/50"
              >
                <div className="aspect-[9/16] relative">
                  {/* Video thumbnail skeleton */}
                  <Skeleton className="w-full h-full rounded-none" />

                  {/* Status badge skeleton */}
                  <div className="absolute top-3 right-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>

                  {/* Card info overlay skeleton */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
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
                {error && error.message
                  ? error.message
                  : "Something went wrong"}
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
              videos.map((video: Video) => (
                <div
                  key={video.id}
                  className="group relative bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-50/90 dark:hover:bg-zinc-800/60 border border-gray-200/50 dark:border-zinc-800/50 hover:border-gray-300/50 dark:hover:border-zinc-700/50 cursor-pointer"
                >
                  {video.videoProgress === "PENDING" ? (
                    <div className="aspect-[9/16] flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-900 relative">
                      <div className="flex flex-col items-center">
                        {/* Simple loading spinner */}
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        {/* Simple text */}
                        <div className="text-center mb-4">
                          <span className="text-base font-medium text-gray-800 dark:text-white block">
                            Generating...
                          </span>
                        </div>

                        {/* Simple dots */}
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-gray-500 dark:bg-zinc-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-gray-500 dark:bg-zinc-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-1.5 h-1.5 bg-gray-500 dark:bg-zinc-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>

                      {/* Card info overlay */}
                      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent dark:from-black/90 dark:via-black/50">
                        <div className="text-sm font-semibold text-white text-left truncate">
                          {video.title}
                        </div>
                        <div className="text-xs text-gray-300 dark:text-zinc-400 text-left flex items-center mt-1">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {formatDistanceToNow(new Date(video.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="aspect-[9/16] relative group"
                      onClick={() => router.push(`/videos/${video.id}`)}
                    >
                      <img
                        src={video.images[0]}
                        alt={video.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
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
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {formatDistanceToNow(new Date(video.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hover effect border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/30 dark:group-hover:border-blue-400/30 transition-colors duration-300 pointer-events-none"></div>
                </div>
              ))}
          </div>
        )}

        {/* Empty state (when no videos) */}
        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-20">
            <div className="relative">
              {/* Background gradient circle */}
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-200/50 to-gray-100/30 dark:from-slate-700/20 dark:to-slate-600/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-300/30 dark:border-slate-600/20">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-300/40 to-gray-200/30 dark:from-slate-600/30 dark:to-slate-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-gray-600 dark:text-slate-300"
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
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-400/30 dark:bg-slate-500/20 rounded-full"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gray-300/40 dark:bg-slate-400/30 rounded-full"></div>
            </div>

            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3">
                Your video library is empty
              </h3>
              <p className="text-gray-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                Start creating amazing videos with our AI-powered platform. Your
                first masterpiece is just a click away.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleCreateVideo}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 dark:from-slate-600 dark:to-slate-700 dark:hover:from-slate-500 dark:hover:to-slate-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-600/30 dark:border-slate-500/30"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create Your First Video
                  </div>
                </button>

                <button className="text-gray-600 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-300 px-6 py-4 font-medium transition-colors duration-200">
                  Learn More
                </button>
              </div>

              {/* Feature highlights */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-200/50 dark:bg-slate-700/30 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-700 dark:text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1">
                    Fast Generation
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-slate-500">
                    Create videos in minutes
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-200/50 dark:bg-slate-700/30 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-700 dark:text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1">
                    AI Powered
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-slate-500">
                    Smart content creation
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-200/50 dark:bg-slate-700/30 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-700 dark:text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1">
                    High Quality
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-slate-500">
                    Professional results
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;

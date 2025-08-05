"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import axios from "axios";
import { useQuery } from "convex/react";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  PauseCircle,
  PlayCircle,
  Upload,
  Video,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface Video {
  id: string;
  title: string;
  videoUrl?: string;
  videoProgress: "PENDING" | "COMPLETED";
  createdAt: string;
}

interface ScheduledUpload {
  id: string;
  videoId: string;
  scheduledDate: string;
  schedulingType: "normal" | "smart";
  description?: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  createdAt: string;
  video: {
    id: string;
    title: string;
  };
}

// Mock data for UI display
const mockVideos: Video[] = [
  {
    id: "1",
    title: "Introduction to React Hooks",
    videoUrl: "https://example.com/video1.mp4",
    videoProgress: "COMPLETED",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    videoUrl: "https://example.com/video2.mp4",
    videoProgress: "COMPLETED",
    createdAt: "2024-01-14T15:30:00Z",
  },
  {
    id: "3",
    title: "Building Modern UIs with Tailwind CSS",
    videoUrl: "https://example.com/video3.mp4",
    videoProgress: "COMPLETED",
    createdAt: "2024-01-13T09:45:00Z",
  },
];

const mockScheduledUploads: ScheduledUpload[] = [
  {
    id: "1",
    videoId: "1",
    scheduledDate: "2024-01-20T18:00:00Z",
    schedulingType: "normal",
    description: "Prime time upload for maximum engagement",
    status: "PENDING",
    createdAt: "2024-01-15T12:00:00Z",
    video: {
      id: "1",
      title: "Introduction to React Hooks",
    },
  },
  {
    id: "2",
    videoId: "2",
    scheduledDate: "20:00:00",
    schedulingType: "smart",
    description: "Daily upload for tech audience",
    status: "PROCESSING",
    createdAt: "2024-01-14T16:00:00Z",
    video: {
      id: "2",
      title: "Advanced TypeScript Patterns",
    },
  },
  {
    id: "3",
    videoId: "3",
    scheduledDate: "2024-01-16T19:30:00Z",
    schedulingType: "normal",
    status: "COMPLETED",
    createdAt: "2024-01-13T11:00:00Z",
    video: {
      id: "3",
      title: "Building Modern UIs with Tailwind CSS",
    },
  },
];

export default function SmartUploadSchedulerPage() {
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cancellingIds, setCancellingIds] = useState<Set<string>>(new Set());

  // Use mock data instead of API calls
  const videos = useQuery(api.videos.getVideos);
  const scheduledUploads = mockScheduledUploads;

  const handleScheduleUpload = async () => {
    if (!selectedVideo || !scheduledTime) {
      alert("Please select a video and set the time");
      return;
    }

    if (!isEnabled && !scheduledDate) {
      alert("Please select a date for normal scheduling");
      return;
    }

    setIsLoading(true);

    try {
      let scheduledDateTime: string | null = null;

      if (isEnabled) {
        // For smart scheduling, create a datetime for today with the specified time
        const today = new Date();
        const [hours, minutes] = scheduledTime.split(":");
        today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        scheduledDateTime = today.toISOString();
      } else {
        // For normal scheduling, combine date and time
        const [hours, minutes] = scheduledTime.split(":");
        const scheduledDateObj = new Date(scheduledDate);
        scheduledDateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        scheduledDateTime = scheduledDateObj.toISOString();
      }

      const scheduleData = {
        videoId: selectedVideo,
        scheduledDateTime,
        schedulingType: isEnabled ? "smart" : "normal",
        description: description || undefined,
      };

      const response = await axios.post("/api/schedule", scheduleData);
      const result = response.data;

      // Reset form on success
      setSelectedVideo("");
      setScheduledDate("");
      setScheduledTime("");
      setDescription("");
      setIsEnabled(false);

      alert("Upload scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling upload:", error);
      alert("Failed to schedule upload. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelUpload = (scheduledId: string) => {
    setCancellingIds((prev) => new Set(prev).add(scheduledId));

    // Simulate cancelling
    setTimeout(() => {
      alert("Upload cancelled successfully! (UI Demo)");
      setCancellingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(scheduledId);
        return newSet;
      });
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case "PROCESSING":
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <PauseCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-50";
      case "FAILED":
        return "text-red-600 bg-red-50";
      case "CANCELLED":
        return "text-gray-600 bg-gray-50";
      case "PROCESSING":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-yellow-600 bg-yellow-50";
    }
  };

  const formatDateTime = (
    dateString: string,
    schedulingType: "normal" | "smart"
  ) => {
    if (schedulingType === "smart") {
      // For smart scheduling, dateString is just time (HH:MM:SS)
      const [hours, minutes] = dateString.split(":");
      const time = new Date();
      time.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return `Daily at ${time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else {
      // For normal scheduling, dateString is full ISO date
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Smart Upload Scheduler</h1>
          <p className="text-muted-foreground">
            Schedule your videos to upload at optimal times for maximum
            engagement
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Scheduling Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Upload
            </CardTitle>
            <CardDescription>
              Select a video and set the date and time for upload
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="scheduler-enabled"
                checked={isEnabled}
                onCheckedChange={(checked) => {
                  setIsEnabled(checked);
                  // Clear date when enabling smart scheduling
                  if (checked) {
                    setScheduledDate("");
                  }
                }}
              />
              <Label htmlFor="scheduler-enabled">Smart Scheduling</Label>
            </div>
            <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg border">
              {isEnabled ? (
                <>
                  <p className="font-medium text-blue-900">
                    Smart Scheduling Active
                  </p>
                  <p>
                    Task will execute daily at the specified time. No date
                    selection needed.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-gray-900">
                    Normal Scheduling Active
                  </p>
                  <p>Task will execute once at the specified date and time.</p>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-select">Select Video</Label>
              <Select value={selectedVideo} onValueChange={setSelectedVideo}>
                <SelectTrigger>
                  <SelectValue placeholder={"Select a video"} />
                </SelectTrigger>
                <SelectContent>
                  {videos?.map((video: any) => (
                    <SelectItem key={video._id} value={video._id}>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        {video.title || "Hi there"}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {videos?.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No completed videos available for scheduling
                </p>
              )}
            </div>

            <div
              className={!isEnabled ? "grid grid-cols-2 gap-4" : "space-y-4"}
            >
              {!isEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="upload-date">Upload Date</Label>
                  <Input
                    id="upload-date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <p className="text-xs text-muted-foreground">
                    Task will execute once on this date
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="upload-time">
                  {isEnabled ? "Daily Upload Time" : "Upload Time"}
                </Label>
                <Input
                  id="upload-time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {isEnabled
                    ? "Task will execute daily at this time"
                    : "Task will execute at this time on the selected date"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a note about this scheduled upload..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button
              onClick={handleScheduleUpload}
              disabled={
                !selectedVideo ||
                !scheduledTime ||
                (!isEnabled && !scheduledDate) ||
                isLoading
              }
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {isEnabled ? "Schedule Daily Upload" : "Schedule Upload"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Settings and Info Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Tips for Better Engagement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Upload when your audience is most active online</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Consider timezone differences for global audiences
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Schedule uploads during peak viewing hours (6-9 PM)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Avoid major holidays and events that might reduce engagement
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scheduled Tasks Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scheduled Tasks
          </CardTitle>
          <CardDescription>
            Your upcoming and completed scheduled uploads
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledUploads ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">
                Loading scheduled tasks...
              </span>
            </div>
          ) : scheduledUploads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No scheduled uploads found</p>
              <p className="text-sm">
                Schedule your first upload above to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledUploads.map((scheduled: ScheduledUpload) => (
                <div
                  key={scheduled.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(scheduled.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{scheduled.video.title}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            scheduled.status
                          )}`}
                        >
                          {scheduled.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          Scheduled for:{" "}
                          {formatDateTime(
                            scheduled.scheduledDate,
                            scheduled.schedulingType
                          )}
                        </p>
                        {scheduled.description && (
                          <p className="text-xs">
                            Note: {scheduled.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">
                      {new Date(scheduled.createdAt).toLocaleDateString()}
                    </div>
                    {scheduled.status === "PENDING" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelUpload(scheduled.id)}
                        disabled={cancellingIds.has(scheduled.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {cancellingIds.has(scheduled.id) ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

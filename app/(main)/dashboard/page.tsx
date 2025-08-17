"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import ConnectYoutubeButton from "../_components/connect-youtube-button";
import RemoveYoutubeButton from "../_components/remove-youtube-button";
import YouTubeChannelInfo from "../_components/youtube-channel-info";
import { toast } from "sonner";

type Props = {};

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function page({}: Props) {
  const [youtubeData, setYoutubeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRemoveYoutube = async () => {
    try {
      setYoutubeData(null);
    } catch (err) {
      console.error("Error removing YouTube connection:", err);
      // You might want to show an error message to the user here
    }
  };

  useEffect(() => {
    const fetchYoutubeData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/youtube");
        setYoutubeData(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching YouTube data:", err);
        setError("Failed to fetch YouTube data");
      } finally {
        setLoading(false);
      }
    };
    fetchYoutubeData();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {loading ? (
          <Skeleton className="h-10 w-32" />
        ) : youtubeData?.channel?.items?.length ? (
          <RemoveYoutubeButton onRemove={handleRemoveYoutube} />
        ) : (
          <ConnectYoutubeButton />
        )}
      </div>

      {loading && <DashboardSkeleton />}

      {!loading && !error && youtubeData && (
        <YouTubeChannelInfo channel={youtubeData.channel} />
      )}
    </div>
  );
}

export default page;

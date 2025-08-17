"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface YouTubeChannelInfoProps {
  channel: {
    items: Array<{
      snippet: {
        title: string;
        description: string;
        customUrl: string;
        publishedAt: string;
        thumbnails: {
          high: {
            url: string;
          };
        };
      };
      statistics: {
        viewCount: string;
        subscriberCount: string;
        videoCount: string;
      };
    }>;
  };
}

const YouTubeChannelInfo: React.FC<YouTubeChannelInfoProps> = ({ channel }) => {
  if (!channel?.items?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            No channel information available
          </p>
        </CardContent>
      </Card>
    );
  }

  const channelData = channel.items[0];
  const { snippet, statistics } = channelData;

  const formatNumber = (num: string) => {
    const number = parseInt(num);
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }
    return number.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <img
              src={snippet.thumbnails.high.url}
              alt={snippet.title}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <CardTitle className="text-xl">{snippet.title}</CardTitle>
              <CardDescription>@{snippet.customUrl}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{snippet.description}</p>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatNumber(statistics.subscriberCount)}
              </div>
              <div className="text-sm text-muted-foreground">Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatNumber(statistics.viewCount)}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatNumber(statistics.videoCount)}
              </div>
              <div className="text-sm text-muted-foreground">Videos</div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Channel created:
            </span>
            <span className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md">
              {formatDate(snippet.publishedAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeChannelInfo;

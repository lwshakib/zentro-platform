"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Unlink, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  onRemove?: () => void;
};

function RemoveYoutubeButton({ onRemove }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleRemoveYoutube = async () => {
    try {
      setIsLoading(true);
      setIsOpen(false);
      const promise = axios.delete("/api/youtube"); 
      toast.promise(promise, {
        loading: "Removing YouTube connection...",
        success: "YouTube connection removed successfully",
        error: "Failed to remove YouTube connection",
      });

      if ((await promise).status === 200) {

        if (onRemove) {
          onRemove();
        }
      } else {
        toast.error("Failed to remove YouTube connection");
      }
    } catch (error) {
      console.error("Error removing YouTube connection:", error);
      toast.error("Failed to disconnect YouTube account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
          disabled={isLoading}
        >
          <Unlink className="w-4 h-4 mr-2" />
          Disconnect YouTube
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" />
            Disconnect YouTube Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to disconnect your YouTube account? This will:
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Remove access to your YouTube channel data</li>
              <li>Stop automatic video processing</li>
              <li>Clear stored channel information</li>
            </ul>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> You can reconnect your YouTube account at
                any time.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemoveYoutube}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Disconnecting...
              </>
            ) : (
              <>
                <Unlink className="w-4 h-4 mr-2" />
                Disconnect Account
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default RemoveYoutubeButton;

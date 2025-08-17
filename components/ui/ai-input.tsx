"use client";

import { upload } from "@imagekit/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Image as ImageIcon,
  Layout,
  Palette,
  Paperclip,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useMutation } from "convex/react";
import { toast } from "sonner";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

const MIN_HEIGHT = 48;
const MAX_HEIGHT = 164;

const AnimatedPlaceholder = ({ activeTool }: { activeTool: ToolType }) => {
  const getPlaceholderText = () => {
    switch (activeTool) {
      case "thumbnail":
        return "Generate thumbnail...";
      case "logo":
        return "Create logo...";
      case "banner":
        return "Design banner...";
      default:
        return "Ask Skiper Ai...";
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={activeTool || "ask"}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.1 }}
        className="pointer-events-none w-[150px] text-sm absolute text-black/70 dark:text-white/70"
      >
        {getPlaceholderText()}
      </motion.p>
    </AnimatePresence>
  );
};

type ToolType = "thumbnail" | "logo" | "banner" | null;

export default function AiInput({ selectedImage }: any) {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });
  const createImage = useMutation(api.images.createImage);
  const createImageGeneration = useMutation(api.images.createImageGeneration);
  const [activeTool, setActiveTool] = useState<ToolType>("thumbnail"); // Set default tool
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handelClose = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    setImagePreview(null); // Use null instead of empty string
  };

  const handelChange = (e: any) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const uploadPromise = (async () => {
        const resp = await axios.get("/api/imagekit-auth");
        const auth = resp.data;

        const response = await upload({
          file,
          fileName: file.name,
          folder: "zentro-platform",
          publicKey: auth.publicKey,
          token: auth.token,
          expire: auth.expire,
          signature: auth.signature,
        });

        const image = await createImage({ url: response.url! });
        return image;
      })();

      toast.promise(uploadPromise, {
        loading: "Uploading image...",
        success: "Image uploaded successfully!",
        error: "Failed to upload image",
      });
    }
  };

  const handleSubmit = async () => {
    // Only submit if there's a value and a tool is selected
    if (value.trim() && activeTool) {
      try {

        const promise = (async()=>{
          const imageId = await createImageGeneration({ prompt: value, type: activeTool.toUpperCase(), status: "QUEUED", selectedImage: selectedImage || null });
          await axios.post("/api/image/generation", {
            imageId,
          })
        })()


        toast.promise(promise, {
          loading: `Generating ${activeTool}...`,
          success: `${activeTool} on processing!`,
          error: "Failed to generate image",
        });

        // Clear the input after successful submission
        setValue("");
        adjustHeight(true);

      } catch (error) {
        console.error("Error generating image:", error);
        toast.error("Failed to generate image");
      }
    }
  };

  const handleToolToggle = (tool: ToolType) => {
    // Don't allow deselecting the tool - always keep one selected
    setActiveTool(tool);
  };

  const getToolConfig = (tool: ToolType) => {
    switch (tool) {
      case "thumbnail":
        return { icon: ImageIcon, label: "Thumbnail", color: "#ff6b35" };
      case "logo":
        return { icon: Palette, label: "Logo", color: "#4ecdc4" };
      case "banner":
        return { icon: Layout, label: "Banner", color: "#45b7d1" };
      default:
        return { icon: ImageIcon, label: "", color: "#ff3f17" };
    }
  };

  const handleEnhancePrompt = async () => {
    setIsEnhancing(true);
    const enhancedPrompt = axios.post("/api/scripts/enhance", {
      prompt: value,
    });
    toast.promise(enhancedPrompt, {
      loading: "Enhancing the prompt...",
      success: "Prompt enhanced successfully!",
      error: "Failed to enhance the prompt",
    });

    const text = await enhancedPrompt;
    setIsEnhancing(false);
    setValue(text.data.data);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl border rounded-[22px] border-black/5 p-1 w-full mx-auto">
        <div className="relative rounded-2xl border border-black/5 bg-neutral-800/5 flex flex-col">
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          >
            <div className="relative">
              <Textarea
                id="ai-input-04"
                value={value}
                placeholder=""
                className="w-full rounded-2xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white resize-none focus-visible:ring-0 leading-[1.2]"
                ref={textareaRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
              />
              {!value && (
                <div className="absolute left-4 top-3">
                  <AnimatedPlaceholder activeTool={activeTool} />
                </div>
              )}
            </div>
          </div>

          <div className="h-12 bg-black/5 dark:bg-white/5 rounded-b-xl">
            <div className="absolute left-3 bottom-3 flex items-center gap-2">
              <label
                className={cn(
                  "cursor-pointer relative rounded-full p-2 bg-black/5 dark:bg-white/5",
                  imagePreview
                    ? "bg-[#ff3f17]/15 border border-[#ff3f17] text-[#ff3f17]"
                    : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handelChange}
                  className="hidden"
                />
                <Paperclip
                  className={cn(
                    "w-4 h-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors",
                    imagePreview && "text-[#ff3f17]"
                  )}
                />
                {imagePreview && (
                  <div className="absolute w-[100px] h-[100px] top-14 -left-4">
                    <Image
                      className="object-cover rounded-2xl"
                      src={imagePreview || "/picture1.jpeg"}
                      height={500}
                      width={500}
                      alt="additional image"
                    />
                    <button
                      onClick={handelClose}
                      className="bg-[#e8e8e8] text-[#464646] absolute -top-1 -left-1 shadow-3xl rounded-full rotate-45"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </label>

              {/* Tool Buttons */}
              {(["thumbnail", "logo", "banner"] as const).map((tool) => {
                const config = getToolConfig(tool);
                const isActive = activeTool === tool;

                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => handleToolToggle(tool)}
                    className={cn(
                      "rounded-full transition-all flex items-center gap-2 px-1.5 py-1 border h-8",
                      isActive
                        ? `bg-[${config.color}]/15 border-[${config.color}] text-[${config.color}]`
                        : "bg-black/5 dark:bg-white/5 border-transparent text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                    )}
                  >
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <motion.div
                        animate={{
                          rotate: isActive ? 180 : 0,
                          scale: isActive ? 1.1 : 1,
                        }}
                        whileHover={{
                          rotate: isActive ? 180 : 15,
                          scale: 1.1,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          },
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 25,
                        }}
                      >
                        <config.icon
                          className={cn(
                            "w-4 h-4",
                            isActive ? `text-[${config.color}]` : "text-inherit"
                          )}
                        />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ width: 0, opacity: 0 }}
                          animate={{
                            width: "auto",
                            opacity: 1,
                          }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`text-sm overflow-hidden whitespace-nowrap text-[${config.color}] flex-shrink-0`}
                        >
                          {config.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleEnhancePrompt?.()}
                disabled={value.trim().length <= 5 || isEnhancing}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  value.trim().length > 5 && !isEnhancing
                    ? "bg-black/5 dark:bg-white/5 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white cursor-pointer"
                    : "bg-black/5 dark:bg-white/5 text-black/10 dark:text-white/10 cursor-not-allowed"
                )}
                title="Enhance prompt"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!value.trim() || isEnhancing}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  value.trim() && !isEnhancing
                    ? "bg-[#ff3f17]/15 text-[#ff3f17] hover:bg-[#ff3f17]/25 cursor-pointer"
                    : "bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

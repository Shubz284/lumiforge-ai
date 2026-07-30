import { useState } from "react";
import type { GeneratedImage } from "@/pages/GenerateImages";
import { CalendarDays, Download, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
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

interface ImageCardProps {
  image: GeneratedImage;
  onPreview: (image: GeneratedImage) => void;
  onDownload: (image: GeneratedImage) => void;
  onDelete: (image: GeneratedImage) => void;
}

const ImageCard = ({ image, onPreview, onDownload, onDelete }: ImageCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = image.prompt.length > 90;


  const prompt = expanded
    ? image.prompt
    : shouldTruncate
      ? image.prompt.slice(0, 90) + "..."
      : image.prompt;

  return (
    <div className="overflow-hidden rounded-xl mb-2 border bg-white shadow-sm transition hover:shadow-md">
      {/* Image */}
      <img
        src={image.storageUrl}
        alt={image.prompt}
        onClick={() => onPreview(image)}
        className="aspect-square w-full cursor-pointer object-cover"
      />

      {/* Details */}
      <div className="space-y-4 p-4">
        {/* Prompt */}
        {/* Prompt */}
        <div>
          <p className="text-xs text-muted-foreground">Prompt</p>

          <p
            className={`mt-1 w-full text-sm font-medium leading-6 ${
              expanded ? "max-h-28 overflow-y-auto pr-2" : "line-clamp-3"
            }`}
          >
            {prompt}
          </p>

          {shouldTruncate && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-xs font-medium text-blue-600 hover:underline"
            >
              {expanded ? "Show less" : "More"}
            </button>
          )}
        </div>

        {/* Model */}
        <div>
          <p className="text-xs text-muted-foreground">Model</p>

          <p className="text-sm">{image.model.replaceAll("/", " / ")}</p>
        </div>

        {/* Date */}
        <div className="flex items-center  gap-1 text-xs text-muted-foreground">
          <CalendarDays size={13} />
          <span>
            {new Date(image.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={() => {
              onDownload(image);
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" className="flex-1 cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              }
            ></AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this image?</AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  image from your account.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => onDelete(image)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;

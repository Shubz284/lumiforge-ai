import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, Trash2 } from "lucide-react";

import type { GeneratedImage } from "@/pages/GenerateImages";

interface ImageDetailsModalProps {
  image: GeneratedImage | null;
  open: boolean;
  onClose: () => void;
  onDownload: (image: GeneratedImage) => void;
  onDelete: (image: GeneratedImage) => void;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const ImageDetailsModal = ({
  image,
  open,
  onClose,
  onDownload,
  onDelete,
}: ImageDetailsModalProps) => {
  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl p-6">
        {/* Image */}
        <img
          src={image.storageUrl}
          alt={image.prompt}
          className="w-full max-h-[380] rounded-xl object-cover"
        />

        {/* Prompt */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Prompt</p>

          <p className="text-sm leading-7 text-foreground">{image.prompt}</p>
        </div>

        {/* Model */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Model</p>

          <p className="text-sm font-medium">{image.model}</p>
        </div>

        {/* Created */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {formatDate(image.createdAt)}
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={() => onDownload(image)}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>

          <Button variant="destructive" onClick={() => onDelete(image)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailsModal;

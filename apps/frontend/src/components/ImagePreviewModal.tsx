import { Dialog,DialogOverlay, DialogPortal } from "@/components/ui/dialog";

import type { GeneratedImage } from "@/pages/GenerateImages";

interface Props {
  image: GeneratedImage | null;
  open: boolean;
  onClose: () => void;
}

const ImagePreviewModal = ({ image, open, onClose }: Props) => {
  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <div className=" fixed inset-0 z-50 flex items-center justify-center">
          <button
            onClick={onClose}
            className=" cursor-pointer absolute top-10 right-10 text-white"
          >
            ✕
          </button>

          <img
            src={image.storageUrl}
            className=" max-w-[60vw] max-h-[60vh] object-contain rounded-xl"
          />
        </div>
      </DialogPortal>
    </Dialog>
  );
};

export default ImagePreviewModal;

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import GradientBackdrop from '@/components/GradientBackdrop';
import { toast } from 'sonner';

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
}

const GetStarted = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFiles = (files: FileList) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const newImages: UploadedImage[] = [];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type`);
        return;
      }

      const url = URL.createObjectURL(file);
      const image: UploadedImage = {
        id: `${Date.now()}-${Math.random()}`,
        url,
        filename: file.name,
        size: file.size,
      };
      newImages.push(image);
    });

    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);
      toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} uploaded`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    setImages((prev) => {
      const imageToDelete = prev.find((img) => img.id === id);
      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      return prev.filter((img) => img.id !== id);
    });
    toast.success('Image deleted');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <GradientBackdrop variant="section" />
      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-4 text-5xl font-bold">Studio</h1>
            <p className="text-xl text-white/80">Upload and manage your images</p>
            {images.length > 0 && (
              <p className="mt-2 text-sm text-white/60">{images.length} image{images.length > 1 ? 's' : ''} uploaded</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
              className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ${
                isDragging
                  ? 'border-primary bg-primary/10 scale-[1.02]'
                  : 'border-white/20 bg-white/5 hover:border-primary/50 hover:bg-white/10'
              } p-12 text-center`}
            >
              <Upload className="mx-auto mb-4 h-16 w-16 text-white/60" />
              <p className="mb-2 text-xl font-medium">
                {isDragging ? 'Drop your images here' : 'Drag & drop images here'}
              </p>
              <p className="text-sm text-white/60">or click to browse</p>
              <p className="mt-4 text-xs text-white/40">Supports: JPG, PNG, GIF, WEBP</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </motion.div>

          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
            >
              <AnimatePresence>
                {images.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-white/5"
                  >
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40" />
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="absolute right-2 top-2 rounded-full bg-black/70 p-2 opacity-0 transition-all duration-300 hover:bg-red-500 group-hover:opacity-100"
                      aria-label="Delete image"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="truncate text-xs text-white">{image.filename}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GetStarted;

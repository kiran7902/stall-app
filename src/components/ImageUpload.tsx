import { useState, useRef, useEffect } from 'react';
import { storage } from '@/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  onError: (error: string) => void;
}

export default function ImageUpload({ onImageUpload, onError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const uploadImage = async (imageData: string) => {
    try {
      setIsUploading(true);
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      const filename = `review_${Date.now()}_${uuidv4()}.jpg`;
      const storageRef = ref(storage, `reviews/${filename}`);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      onImageUpload(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
      onError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      uploadImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture={isMobile ? "environment" : undefined}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <Camera className="w-4 h-4" />
        Take Photo
      </button>

      {previewUrl && (
        <div className="mt-2">
          <Image
            src={previewUrl}
            alt="Preview"
            width={500}
            height={300}
            className="w-full h-auto rounded-md"
            unoptimized
          />
        </div>
      )}
    </div>
  );
} 
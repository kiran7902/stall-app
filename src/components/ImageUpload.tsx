import { useState, useRef, useEffect } from 'react';
import { storage } from '@/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Camera, Upload } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  onError: (error: string) => void;
}

export default function ImageUpload({ onImageUpload, onError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
      setStream(mediaStream);
      setShowCamera(true);
    } catch (error) {
      console.error('Camera error:', error);
      onError('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setPreviewUrl(imageData);
        await uploadImage(imageData);
        stopCamera();
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      onError('Failed to capture photo. Please try again.');
    }
  };

  const uploadImage = async (imageData: string) => {
    try {
      setIsUploading(true);
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      // Generate a unique filename using timestamp
      const filename = `review_${Date.now()}.jpg`;
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
        className="hidden"
      />

      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          Upload Photo
        </button>
        <button
          onClick={showCamera ? stopCamera : startCamera}
          disabled={isUploading}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Camera className="w-4 h-4" />
          {showCamera ? 'Close Camera' : 'Take Photo'}
        </button>
      </div>

      {showCamera && (
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-md"
          />
          <button
            onClick={capturePhoto}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <Camera className="w-6 h-6" />
          </button>
        </div>
      )}

      {previewUrl && !showCamera && (
        <div className="mt-2">
          <Image
            src={previewUrl}
            alt="Preview"
            width={500}
            height={300}
            className="w-full h-auto rounded-md"
          />
        </div>
      )}
    </div>
  );
} 
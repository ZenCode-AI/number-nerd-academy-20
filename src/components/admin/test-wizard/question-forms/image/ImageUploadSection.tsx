
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { validateImageFile, validateImageResolution } from '@/utils/testValidation';

interface ImageUploadSectionProps {
  questionNumber: number;
  imageUrl?: string;
  onImageUpload: (url: string) => void;
}

const ImageUploadSection = ({ questionNumber, imageUrl, onImageUpload }: ImageUploadSectionProps) => {
  const [imageValidation, setImageValidation] = useState<{ isValid: boolean; error?: string } | null>(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsValidatingImage(true);
    
    // Validate file type and size
    const fileValidation = validateImageFile(file);
    if (!fileValidation.isValid) {
      setImageValidation(fileValidation);
      setIsValidatingImage(false);
      return;
    }

    // Create image element to validate resolution
    const img = new Image();
    img.onload = () => {
      const resolutionValidation = validateImageResolution(img);
      if (!resolutionValidation.isValid) {
        setImageValidation(resolutionValidation);
        setIsValidatingImage(false);
        return;
      }

      // Convert to base64 data URL for persistent storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        onImageUpload(base64Url);
        setImageValidation({ isValid: true });
        setIsValidatingImage(false);
      };
      reader.onerror = () => {
        setImageValidation({ isValid: false, error: 'Failed to process image file. Please try again.' });
        setIsValidatingImage(false);
      };
      reader.readAsDataURL(file);
    };

    img.onerror = () => {
      setImageValidation({ isValid: false, error: 'Invalid image file. Please try a different image.' });
      setIsValidatingImage(false);
    };

    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="space-y-2">
      <Label>Question Image *</Label>
      <div className="space-y-3">
        <Input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleImageUpload}
          className="hidden"
          id={`image-${questionNumber}`}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(`image-${questionNumber}`)?.click()}
          className="w-full"
          disabled={isValidatingImage}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isValidatingImage ? 'Validating Image...' : 'Upload Image'}
        </Button>
        
        {/* Image validation feedback */}
        {imageValidation && (
          <div className={`flex items-center gap-2 text-sm ${
            imageValidation.isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {imageValidation.isValid ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {imageValidation.isValid ? 'Image validated successfully' : imageValidation.error}
          </div>
        )}
        
        {/* Image requirements */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Requirements:</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>File types: JPEG, PNG, GIF, WebP</li>
            <li>Maximum size: 5MB</li>
            <li>Minimum resolution: 100x100 pixels</li>
            <li>Maximum resolution: 2048x2048 pixels</li>
          </ul>
        </div>

        {imageUrl && imageValidation?.isValid && (
          <div className="border rounded-lg p-2">
            <img 
              src={imageUrl} 
              alt="Question" 
              className="max-w-full h-auto max-h-48 mx-auto rounded" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadSection;

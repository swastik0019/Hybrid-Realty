// components/DirectCloudinaryUpload.jsx
import { useState, useEffect } from "react";
import { Upload, X, Loader, AlertCircle, CheckCircle } from "lucide-react";
import { compressImage } from "../utils/imageCompression";

/**
 * A component for directly uploading images to Cloudinary
 * This bypasses server file size limits by uploading directly to Cloudinary
 */
const DirectCloudinaryUpload = ({ 
  onImagesUploaded, 
  maxImages = 15, 
  folder = "property-uploads",
  className = ""
}) => {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [cloudinaryUrls, setCloudinaryUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  // This should be set on the server side and fetched in a real implementation
  // For now we'll hardcode it
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_unsigned_upload_preset";
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name";

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Update parent component when cloudinary URLs change
  useEffect(() => {
    if (cloudinaryUrls.length > 0) {
      onImagesUploaded(cloudinaryUrls);
    }
  }, [cloudinaryUrls, onImagesUploaded]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImages(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addImages(Array.from(e.target.files));
    }
  };

  const addImages = async (files) => {
    if (files.length + images.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setError(null);
    
    try {
      // Process and compress images
      const processedFiles = [];
      
      for (const file of files) {
        // Skip non-image files
        if (!file.type.startsWith('image/')) {
          setError('Only image files are allowed');
          setTimeout(() => setError(null), 3000);
          continue;
        }
        
        // Compress the image
        const compressedFile = await compressImage(file, 2, 1920);
        processedFiles.push(compressedFile);
      }
      
      // Create preview URLs
      const newPreviewUrls = processedFiles.map(file => URL.createObjectURL(file));
      
      // Update state
      setImages(prev => [...prev, ...processedFiles]);
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
    } catch (error) {
      console.error('Error processing images:', error);
      setError('Error processing images. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const removeImage = (index) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    
    // Remove the image and preview URL from state
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    // Remove from cloudinary URLs if already uploaded
    if (cloudinaryUrls[index]) {
      setCloudinaryUrls(prev => prev.filter((_, i) => i !== index));
    }
    
    // Remove from progress tracking
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
  };

  const uploadToCloudinary = async () => {
    if (images.length === 0) {
      setError('Please add at least one image first');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setUploading(true);
    const urls = [];
    
    try {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        setUploadProgress(prev => ({ ...prev, [i]: 0 }));
        
        // Create form data for Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', folder);
        
        
        // Create and configure XHR for progress tracking
        const xhr = new XMLHttpRequest();
        
        // Promise to track completion
        const uploadPromise = new Promise((resolve, reject) => {
          xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
          
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(prev => ({ ...prev, [i]: progress }));
            }
          };
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText);
              resolve(response.secure_url);
            } else {
              reject(new Error('Upload failed'));
            }
          };
          
          xhr.onerror = () => reject(new Error('Upload failed'));
        });
        
        // Send the request
        xhr.send(formData);
        
        // Wait for upload to complete
        const secureUrl = await uploadPromise;
        urls.push(secureUrl);
        
        // Set upload as completed
        setUploadProgress(prev => ({ ...prev, [i]: 100 }));
      }
      
      // All uploads completed successfully
      setCloudinaryUrls(urls);
      
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      setError('Error uploading images. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Success message */}
      {cloudinaryUrls.length > 0 && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{cloudinaryUrls.length} images uploaded successfully!</span>
        </div>
      )}
      
      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('direct-image-upload').click()}
      >
        <input
          id="direct-image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
            <Upload className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            Drag and drop your images here
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse your files
          </p>
          <p className="text-xs text-gray-400">
            Maximum {maxImages} images (JPEG, PNG)
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Images will be compressed and uploaded directly to Cloudinary
          </p>
        </div>
      </div>
      
      {/* Image previews */}
      {previewUrls.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">
              Selected Images ({previewUrls.length}/{maxImages})
            </h3>
            
            <button
              type="button"
              onClick={uploadToCloudinary}
              disabled={uploading || previewUrls.length === 0}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                uploading
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload to Cloudinary</span>
                </>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden h-32 bg-gray-100 shadow-md"
              >
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Progress overlay */}
                {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                    <div className="h-1 w-3/4 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full"
                        style={{ width: `${uploadProgress[index]}%` }}
                      ></div>
                    </div>
                    <span className="text-sm mt-2">{uploadProgress[index]}%</span>
                  </div>
                )}
                
                {/* Success indicator */}
                {uploadProgress[index] === 100 && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
                
                {/* Remove button */}
                {(!uploading || uploadProgress[index] === undefined) && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition-colors"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectCloudinaryUpload;
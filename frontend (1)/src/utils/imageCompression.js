// utils/imageCompression.js
/**
 * Compresses an image file before upload
 * @param {File} file - The image file to compress
 * @param {number} maxSizeMB - Maximum file size in MB
 * @param {number} maxWidthOrHeight - Maximum width or height in pixels
 * @param {number} quality - Image quality (0-1)
 * @returns {Promise<File>} - Compressed file
 */
export const compressImage = (file, maxSizeMB = 1, maxWidthOrHeight = 1920, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      // Skip non-image files
      if (!file.type.startsWith('image/')) {
        return resolve(file);
      }
  
      // Skip if file is already smaller than 80% of maxSizeMB
      if (file.size < maxSizeMB * 1024 * 1024 * 0.8) {
        return resolve(file);
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidthOrHeight) {
              height = Math.round(height * maxWidthOrHeight / width);
              width = maxWidthOrHeight;
            }
          } else {
            if (height > maxWidthOrHeight) {
              width = Math.round(width * maxWidthOrHeight / height);
              height = maxWidthOrHeight;
            }
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Adjust quality based on file size
          let adjustedQuality = quality;
          if (file.size > maxSizeMB * 1024 * 1024 * 2) {
            adjustedQuality = Math.min(quality, 0.5); // Lower quality for very large files
          }
          
          // Convert to Blob
          canvas.toBlob((blob) => {
            if (!blob) {
              console.error('Canvas to Blob conversion failed');
              return resolve(file); // Fall back to original file
            }
            
            // Create a new File from the blob
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: new Date().getTime()
            });
            
            console.log(`Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
            
            // If the compressed file is still too large, try again with lower quality
            if (compressedFile.size > maxSizeMB * 1024 * 1024 && adjustedQuality > 0.3) {
              compressImage(file, maxSizeMB, maxWidthOrHeight, adjustedQuality - 0.2)
                .then(resolve)
                .catch(reject);
            } else {
              resolve(compressedFile);
            }
          }, file.type, adjustedQuality);
        };
        
        img.onerror = () => {
          console.error('Error loading image for compression');
          resolve(file); // Fall back to original file
        };
      };
      
      reader.onerror = () => {
        console.error('Error reading file for compression');
        resolve(file); // Fall back to original file
      };
    });
  };
  
  /**
   * Processes multiple image files with compression
   * @param {File[]} files - Array of image files
   * @param {number} maxSizeMB - Maximum size per file in MB
   * @param {number} maxWidthOrHeight - Maximum width or height in pixels
   * @returns {Promise<File[]>} - Array of compressed files
   */
  export const processMultipleImages = async (files, maxSizeMB = 1, maxWidthOrHeight = 1920) => {
    const compressedFiles = [];
    
    for (const file of files) {
      try {
        const compressedFile = await compressImage(file, maxSizeMB, maxWidthOrHeight);
        compressedFiles.push(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        compressedFiles.push(file); // Add original file as fallback
      }
    }
    
    return compressedFiles;
  };
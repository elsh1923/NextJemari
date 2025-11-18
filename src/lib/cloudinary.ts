import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn(
    "⚠️  Cloudinary credentials not set. Image uploads will not work. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file."
  );
}

export { cloudinary };

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  file: File | Buffer | string,
  folder: string = "nextjemari",
  options: {
    resource_type?: "image" | "video" | "raw" | "auto";
    transformation?: any;
    public_id?: string;
  } = {}
): Promise<{ secure_url: string; public_id: string }> {
  const { resource_type = "image", transformation, public_id } = options;

  return new Promise(async (resolve, reject) => {
    try {
      let buffer: Buffer;

      if (typeof file === "string") {
        // If it's a base64 string
        if (file.startsWith("data:")) {
          const base64Data = file.split(",")[1];
          buffer = Buffer.from(base64Data, "base64");
        } else {
          // If it's a URL, fetch it
          const response = await fetch(file);
          const arrayBuffer = await response.arrayBuffer();
          buffer = Buffer.from(arrayBuffer);
        }
      } else if (file instanceof Buffer) {
        buffer = file;
      } else if (file instanceof File) {
        // If it's a File object, convert to buffer
        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } else {
        throw new Error("Invalid file type");
      }

      const uploadOptions: any = {
        folder,
        resource_type,
        overwrite: true,
        invalidate: true,
      };

      if (transformation) {
        uploadOptions.transformation = transformation;
      }

      if (public_id) {
        uploadOptions.public_id = public_id;
      }

      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          } else {
            reject(new Error("Upload failed: No result returned"));
          }
        })
        .end(buffer);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Upload image with optimization
 */
export async function uploadImage(
  file: File | Buffer | string,
  folder: string = "nextjemari",
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "jpg" | "png" | "webp";
    public_id?: string;
  } = {}
): Promise<string> {
  const { width, height, quality = "auto", format = "auto", public_id } = options;

  const transformation: any = {
    quality,
    fetch_format: format,
  };

  if (width) transformation.width = width;
  if (height) transformation.height = height;

  const result = await uploadToCloudinary(file, folder, {
    resource_type: "image",
    transformation,
    public_id,
  });

  return result.secure_url;
}

/**
 * Get optimized image URL from Cloudinary
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | string;
    format?: "auto" | "jpg" | "png" | "webp";
  } = {}
): string {
  const { width, height, quality = "auto", format = "auto" } = options;

  const urlOptions: any = {
    secure: true,
  };

  if (width) urlOptions.width = width;
  if (height) urlOptions.height = height;
  if (quality) urlOptions.quality = quality;
  if (format) urlOptions.fetch_format = format;

  return cloudinary.url(publicId, urlOptions);
}


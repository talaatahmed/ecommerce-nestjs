import { v2 as cloudinaryV2, UploadApiOptions, UploadApiResponse } from 'cloudinary';

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFileOnCloudinary = async (file: string, options: UploadApiOptions) => {
  const result = await cloudinaryV2.uploader.upload(file, options);
  return result;
};

interface DestroyApiResponse {
  result?: string;
  [key: string]: any;
}

export const DeleteFileFromCloudinary = async (public_id: string): Promise<DestroyApiResponse> => {
  const result = await cloudinaryV2.uploader.destroy(public_id);
  return result;
};

interface FileUploadResult {
  secure_url: string;
  public_id: string;
}

export const uploadManyFilesOnCloudinary = async (
  files: string[],
  options: UploadApiOptions,
): Promise<FileUploadResult[]> => {
  const result: FileUploadResult[] = [];
  for (const file of files) {
    const uploadResult = await uploadFileOnCloudinary(file, options);
    result.push({
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  }
  return result;
};

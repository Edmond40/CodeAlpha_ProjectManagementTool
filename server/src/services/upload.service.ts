import cloudinary from '../utils/cloudinary';

export async function uploadImage(base64Data: string, folder: string) {
  const result = await cloudinary.uploader.upload(base64Data, {
    folder,
    resource_type: 'image'
  });
  return result.secure_url;
}

export async function uploadAttachment(fileData: string, folder: string) {
  const result = await cloudinary.uploader.upload(fileData, {
    folder,
    resource_type: 'auto'
  });
  return result.secure_url;
}

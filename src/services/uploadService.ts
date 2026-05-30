import { api } from './api';

export const uploadService = {
  uploadLogo: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await api.post<{ url: string }>('/uploads/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadAttachment: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('attachment', file);
    const response = await api.post<{ url: string }>('/uploads/attachment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

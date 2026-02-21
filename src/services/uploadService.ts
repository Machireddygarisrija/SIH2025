import { apiService } from './api';

interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

class UploadService {
  async uploadResume(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    return apiService.uploadFile<UploadResponse>('/upload/resume', file, onProgress);
  }

  async uploadProfilePicture(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    return apiService.uploadFile<UploadResponse>('/upload/profile-picture', file, onProgress);
  }

  async uploadDocument(file: File, type: string, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return apiService.post<UploadResponse>('/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  async deleteFile(filename: string): Promise<void> {
    return apiService.delete(`/upload/${filename}`);
  }
}

export const uploadService = new UploadService();
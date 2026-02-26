import api from './api';

export interface Document {
  id: string;
  filename: string;
  file_url: string;
  page_count: number;
  created_at: string;
  user_id?: string;
}

export const documentService = {
  getDocuments: async (): Promise<Document[]> => {
    const response = await api.get<Document[]>('/documents/');
    return response.data;
  },

  getDocumentViewUrl: async (documentId: string): Promise<{ url: string }> => {
    const response = await api.get<{ url: string }>(`/documents/${documentId}/view-url`);
    return response.data;
  },

  uploadDocument: async (file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<Document>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteDocument: async (documentId: string): Promise<void> => {
    await api.delete(`/documents/${documentId}`);
  }
};

import api from './api';

/**
 * Maps frontend action keys to backend AIActionType enum values.
 */
const ACTION_MAP: Record<string, string> = {
  explain: 'explain_simple',
  define: 'define',
  example: 'example',
  analogy: 'analogy',
  acronym: 'expand_acronym',
};

export interface AIHighlightResponse {
  id: string;
  document_id: string;
  input_text: string;
  response_text: string;
  created_at: string;
}

export const aiService = {
  highlightText: async (
    documentId: string,
    selectedText: string,
    action: string
  ): Promise<AIHighlightResponse> => {
    const backendAction = ACTION_MAP[action] || action;

    const response = await api.post<AIHighlightResponse>('/ai/highlight', {
      document_id: documentId,
      selected_text: selectedText,
      action: backendAction,
    });

    return response.data;
  },
};

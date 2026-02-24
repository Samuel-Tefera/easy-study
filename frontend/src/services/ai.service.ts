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

/**
 * Reverse map: backend enum → frontend action key.
 */
const REVERSE_ACTION_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ACTION_MAP).map(([k, v]) => [v, k])
);

export interface AIHighlightResponse {
  id: string;
  document_id: string;
  action: string;
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

  getHistory: async (documentId: string): Promise<AIHighlightResponse[]> => {
    const response = await api.get<AIHighlightResponse[]>(`/ai/history/${documentId}`);
    return response.data;
  },

  /** Convert a backend action value to the frontend key. */
  toFrontendAction: (backendAction: string): string => {
    return REVERSE_ACTION_MAP[backendAction] || backendAction;
  },
};


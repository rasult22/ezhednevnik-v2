import { OutputData } from '@editorjs/editorjs';

/**
 * Idea data structure
 */
export interface Idea {
  id: string;
  title: string;
  content: OutputData; // Editor.js JSON format
  createdAt: string;
  updatedAt: string;
}

/**
 * Idea creation payload (without generated fields)
 */
export interface CreateIdeaPayload {
  title: string;
  content: OutputData;
}

/**
 * Idea update payload (partial updates)
 */
export interface UpdateIdeaPayload {
  title?: string;
  content?: OutputData;
}

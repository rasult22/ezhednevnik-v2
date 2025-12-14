import { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";

/**
 * Sketch data structure
 */
export interface Sketch {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  excalidrawData: {
    elements: readonly ExcalidrawElement[];
    appState: Partial<AppState>;
    files: BinaryFiles;
  };
}

/**
 * Sketch creation payload (without generated fields)
 */
export interface CreateSketchPayload {
  title: string;
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
}

/**
 * Sketch update payload (partial updates)
 */
export interface UpdateSketchPayload {
  title?: string;
  elements?: readonly ExcalidrawElement[];
  appState?: Partial<AppState>;
  files?: BinaryFiles;
}

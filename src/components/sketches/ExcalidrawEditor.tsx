import { useEffect, useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type { ExcalidrawElement, AppState, BinaryFiles, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

interface ExcalidrawEditorProps {
  initialElements?: readonly ExcalidrawElement[];
  initialAppState?: Partial<AppState>;
  initialFiles?: BinaryFiles;
  onChange?: (
    elements: readonly ExcalidrawElement[],
    appState: Partial<AppState>,
    files: BinaryFiles
  ) => void;
}

/**
 * ExcalidrawEditor Component - Wrapper for Excalidraw with change handling
 */
export function ExcalidrawEditor({
  initialElements = [],
  initialAppState = {},
  initialFiles = {},
  onChange,
}: ExcalidrawEditorProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  // Ensure appState has required properties
  const safeAppState: Partial<AppState> = {
    ...initialAppState,
    collaborators: initialAppState.collaborators || new Map(),
  };

  // Load initial data when API is ready
  useEffect(() => {
    if (excalidrawAPI && initialElements.length > 0) {
      excalidrawAPI.updateScene({
        elements: initialElements,
        appState: safeAppState,
      });
    }
  }, [excalidrawAPI, initialElements, safeAppState]);

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={(elements, appState, files) => {
          onChange?.(elements, appState, files);
        }}
        initialData={{
          elements: initialElements,
          appState: safeAppState,
          files: initialFiles,
        }}
      />
    </div>
  );
}

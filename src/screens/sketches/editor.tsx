import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSketchesStore } from '../../stores/useSketchesStore';
import { ExcalidrawEditor } from '../../components/sketches/ExcalidrawEditor';
import { Button } from '../../components/ui/Button';
import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { AppState, BinaryFiles } from '@excalidraw/excalidraw/types';

/**
 * Sketch Editor Screen - Create or edit a sketch with Excalidraw
 */
export default function SketchEditorScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const createSketch = useSketchesStore((state) => state.createSketch);
  const updateSketch = useSketchesStore((state) => state.updateSketch);
  const getSketch = useSketchesStore((state) => state.getSketch);

  const [title, setTitle] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Store current sketch data
  const currentDataRef = useRef<{
    elements: readonly ExcalidrawElement[];
    appState: Partial<AppState>;
    files: BinaryFiles;
  }>({
    elements: [],
    appState: {},
    files: {},
  });

  // Load existing sketch if editing
  useEffect(() => {
    if (id) {
      const sketch = getSketch(id);
      if (sketch) {
        setTitle(sketch.title);
        currentDataRef.current = {
          elements: sketch.excalidrawData.elements,
          appState: sketch.excalidrawData.appState,
          files: sketch.excalidrawData.files,
        };
      } else {
        // Sketch not found, redirect to list
        navigate('/sketches');
      }
    } else {
      // New sketch - set default title
      setTitle(`Эскиз ${new Date().toLocaleDateString('ru-RU')}`);
    }
  }, [id, getSketch, navigate]);

  // Handle Excalidraw changes
  const handleExcalidrawChange = useCallback(
    (elements: readonly ExcalidrawElement[], appState: Partial<AppState>, files: BinaryFiles) => {
      currentDataRef.current = { elements, appState, files };
      setHasUnsavedChanges(true);
    },
    []
  );

  // Save sketch and navigate back to list (only when user clicks Save button)
  const handleSave = useCallback(() => {
    setIsSaving(true);

    if (id) {
      // Update existing sketch
      updateSketch(id, {
        title,
        elements: currentDataRef.current.elements,
        appState: currentDataRef.current.appState,
        files: currentDataRef.current.files,
      });
    } else {
      // Create new sketch
      createSketch({
        title,
        elements: currentDataRef.current.elements,
        appState: currentDataRef.current.appState,
        files: currentDataRef.current.files,
      });
    }

    setHasUnsavedChanges(false);
    setIsSaving(false);
    
    // Navigate back to sketches list after save
    navigate('/sketches');
  }, [id, title, createSketch, updateSketch, navigate]);

  const handleBack = () => {
    // Simply navigate back - browser will handle unsaved changes warning if needed
    navigate('/sketches');
  };

  // Get initial data for Excalidraw
  const initialData = id ? getSketch(id) : null;

  return (
    <div className="h-screen flex flex-col bg-dark-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-sm border-b border-glass-border p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-4 flex-1">
          <Button variant="secondary" size="sm" onClick={handleBack}>
            ← Назад
          </Button>
          
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Название эскиза"
            className="flex-1 max-w-md px-4 py-2 bg-glass-light border border-glass-border rounded-glass-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="text-sm text-text-muted">• Несохранено</span>
          )}
          {isSaving && (
            <span className="text-sm text-accent-blue">• Сохранение...</span>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gradient-bg-primary"
          >
            💾 Сохранить
          </Button>
        </div>
      </motion.div>

      {/* Excalidraw Editor */}
      <div className="flex-1 overflow-hidden">
        <ExcalidrawEditor
          initialElements={initialData?.excalidrawData.elements}
          initialAppState={initialData?.excalidrawData.appState}
          initialFiles={initialData?.excalidrawData.files}
          onChange={handleExcalidrawChange}
        />
      </div>
    </div>
  );
}

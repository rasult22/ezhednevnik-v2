import { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';

interface EditorJsComponentProps {
  data?: OutputData;
  onChange: (data: OutputData) => void;
  placeholder?: string;
}

/**
 * Editor.js React Component Wrapper
 * Provides rich text editing capabilities
 */
export function EditorJsComponent({
  data,
  onChange,
  placeholder = 'Начните писать свою идею...',
}: EditorJsComponentProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!holderRef.current) return;
    
    // Prevent re-initialization if editor already exists
    if (editorRef.current) return;

    // Initialize Editor.js
    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder,
      data: data || {
        blocks: [],
      },
      tools: {
        header: {
          // @ts-ignore - Editor.js types mismatch
          class: Header,
          config: {
            placeholder: 'Заголовок',
            levels: [1, 2, 3, 4],
            defaultLevel: 2,
          },
        },
        list: {
          // @ts-ignore - Editor.js types mismatch
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        paragraph: {
          // @ts-ignore - Editor.js types mismatch
          class: Paragraph,
          inlineToolbar: true,
        },
        checklist: {
          // @ts-ignore - Editor.js types mismatch
          class: Checklist,
          inlineToolbar: true,
        },
        quote: {
          // @ts-ignore - Editor.js types mismatch
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Введите цитату',
            captionPlaceholder: 'Автор цитаты',
          },
        },
        code: {
          // @ts-ignore - Editor.js types mismatch
          class: Code,
          config: {
            placeholder: 'Введите код',
          },
        },
      },
      onChange: async () => {
        try {
          const outputData = await editor.save();
          onChange(outputData);
        } catch (error) {
          console.error('Error saving editor data:', error);
        }
      },
      minHeight: 300,
    });

    editorRef.current = editor;

    // Cleanup on unmount
    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []); // Only initialize once

  return (
    <div
      ref={holderRef}
      className="prose prose-invert max-w-none bg-glass-light rounded-glass-md p-6 min-h-[300px] border border-glass-border"
    />
  );
}

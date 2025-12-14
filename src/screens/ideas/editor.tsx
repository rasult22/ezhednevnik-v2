import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { EditorJsComponent } from '../../components/ideas/EditorJsComponent';
import { useIdeasStore } from '../../stores/useIdeasStore';
import type { OutputData } from '@editorjs/editorjs';

/**
 * Idea Editor Screen - Create or edit ideas
 */
export default function IdeaEditorScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const createIdea = useIdeasStore((state) => state.createIdea);
  const updateIdea = useIdeasStore((state) => state.updateIdea);
  const getIdea = useIdeasStore((state) => state.getIdea);

  const existingIdea = id ? getIdea(id) : undefined;

  const [title, setTitle] = useState(existingIdea?.title || '');
  const [content, setContent] = useState<OutputData>(
    existingIdea?.content || { blocks: [] }
  );
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save timer
  useEffect(() => {
    if (!id || !title || !content.blocks?.length) return;

    const timeoutId = setTimeout(() => {
      setIsSaving(true);
      updateIdea(id, { title, content });
      setTimeout(() => setIsSaving(false), 500);
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [title, content, id, updateIdea]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Пожалуйста, введите название идеи');
      return;
    }

    if (id) {
      // Update existing
      updateIdea(id, { title, content });
    } else {
      // Create new
      createIdea({ title, content });
    }

    navigate('/ideas');
  };

  const handleCancel = () => {
    if (window.confirm('Вы уверены? Несохраненные изменения будут потеряны.')) {
      navigate('/ideas');
    }
  };

  return (
    <Container size="xl">
      <div className="py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleCancel}
              variant="secondary"
              size="sm"
            >
              ← Назад
            </Button>
            <h1 className="text-3xl font-bold gradient-text">
              {id ? 'Редактировать идею' : 'Новая идея'}
            </h1>
            {isSaving && (
              <span className="text-sm text-success animate-pulse">
                Сохранено
              </span>
            )}
          </div>
          <Button
            onClick={handleSave}
            variant="primary"
            className="bg-gradient-to-r from-accent-yellow to-accent-orange"
          >
            {id ? 'Сохранить' : 'Создать'}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Title Input */}
          <Card>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название идеи..."
              className="w-full bg-transparent border-none text-2xl font-bold text-text-primary placeholder-text-muted focus:outline-none"
              autoFocus
            />
          </Card>

          {/* Editor */}
          <Card>
            <EditorJsComponent
              data={content}
              onChange={setContent}
              placeholder="Начните описывать свою идею..."
            />
          </Card>

          {/* Action Buttons (Mobile) */}
          <div className="flex gap-3 md:hidden">
            <Button
              onClick={handleCancel}
              variant="secondary"
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              className="flex-1 bg-gradient-to-r from-accent-yellow to-accent-orange"
            >
              {id ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}

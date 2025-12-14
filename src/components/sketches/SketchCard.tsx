import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Sketch } from '../../types/sketch';
import { Button } from '../ui/Button';

interface SketchCardProps {
  sketch: Sketch;
  onDelete: (id: string) => void;
}

/**
 * SketchCard Component - Displays a sketch in the list view
 */
export function SketchCard({ sketch, onDelete }: SketchCardProps) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete(sketch.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCardClick = () => {
    navigate(`/sketches/${sketch.id}`);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass hover:shadow-glass-hover transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Thumbnail Preview */}
      <div className="h-48 bg-gradient-to-br from-glass-light to-glass-medium rounded-t-glass border-b border-glass-border flex items-center justify-center">
        <div className="text-6xl opacity-50 group-hover:scale-110 transition-transform">
          ✏️
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-2 truncate">
          {sketch.title || 'Untitled Sketch'}
        </h3>

        <div className="flex items-center justify-between text-xs text-text-muted mb-3">
          <span>
            Создано: {format(new Date(sketch.createdAt), 'd MMM yyyy', { locale: ru })}
          </span>
          <span>
            Обновлено: {format(new Date(sketch.updatedAt), 'd MMM yyyy', { locale: ru })}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!showDeleteConfirm ? (
            <>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
              >
                Открыть
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
              >
                🗑️
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={handleDelete}
              >
                Подтвердить удаление
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancel}
              >
                Отмена
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useSketchesStore } from '../../stores/useSketchesStore';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/layout/Container';

/**
 * Sketches List Screen - Display all sketches in table format
 */
export default function SketchesListScreen() {
  const navigate = useNavigate();
  const sketches = useSketchesStore((state) => state.sketches);
  const deleteSketch = useSketchesStore((state) => state.deleteSketch);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleNewSketch = () => {
    navigate('/sketches/new');
  };

  const handleOpenSketch = (id: string) => {
    navigate(`/sketches/${id}`);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deletingId === id) {
      // Confirm delete
      deleteSketch(id);
      setDeletingId(null);
    } else {
      // First click - show confirm
      setDeletingId(id);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(null);
  };

  return (
    <Container>
      {/* Header */}
      <div className="mb-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">✏️ Эскизы</h1>
            <p className="text-text-secondary">
              Создавайте и управляйте визуальными эскизами с Excalidraw
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleNewSketch}
            className="gradient-bg-primary"
          >
            ➕ Новый эскиз
          </Button>
        </div>

        {/* Stats */}
        <div className="glass-sm p-4 inline-flex items-center gap-2">
          <span className="text-text-muted">Всего эскизов:</span>
          <span className="text-2xl font-bold gradient-text">{sketches.length}</span>
        </div>
      </div>

      {/* Sketches Table */}
      {sketches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 text-center"
        >
          <div className="text-6xl mb-4">✏️</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Нет эскизов
          </h2>
          <p className="text-text-secondary mb-6">
            Создайте свой первый эскиз, чтобы начать рисовать
          </p>
          <Button variant="primary" onClick={handleNewSketch}>
            Создать первый эскиз
          </Button>
        </motion.div>
      ) : (
        <div className="glass overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border bg-glass-light">
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Название
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Создано
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Обновлено
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-text-primary">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {sketches.map((sketch, index) => (
                <motion.tr
                  key={sketch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-glass-border hover:bg-glass-light transition-colors cursor-pointer"
                  onClick={() => handleOpenSketch(sketch.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✏️</span>
                      <span className="text-text-primary font-medium">
                        {sketch.title || 'Untitled Sketch'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-sm">
                    {format(new Date(sketch.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru })}
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-sm">
                    {format(new Date(sketch.updatedAt), 'd MMMM yyyy, HH:mm', { locale: ru })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {deletingId === sketch.id ? (
                        <>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={(e) => handleDeleteClick(sketch.id, e)}
                          >
                            Подтвердить
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCancelDelete}
                          >
                            Отмена
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSketch(sketch.id);
                            }}
                          >
                            Открыть
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={(e) => handleDeleteClick(sketch.id, e)}
                          >
                            🗑️
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
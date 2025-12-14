import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { useIdeasStore } from '../../stores/useIdeasStore';
import { format } from 'date-fns';

/**
 * Ideas List Screen - Display all ideas with search
 */
export default function IdeasScreen() {
  const navigate = useNavigate();
  const ideas = useIdeasStore((state) => state.ideas);
  const deleteIdea = useIdeasStore((state) => state.deleteIdea);
  const searchIdeas = useIdeasStore((state) => state.searchIdeas);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIdeas, setFilteredIdeas] = useState(ideas);

  // Update filtered ideas when search query or ideas change
  useEffect(() => {
    setFilteredIdeas(searchIdeas(searchQuery));
  }, [searchQuery, ideas, searchIdeas]);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Удалить идею "${title}"?`)) {
      deleteIdea(id);
    }
  };

  const getPreviewText = (content: any): string => {
    if (!content.blocks || content.blocks.length === 0) return 'Пустая идея';
    
    // Get text from first text block
    const firstTextBlock = content.blocks.find((block: any) => 
      block.data?.text || block.data?.caption
    );
    
    if (firstTextBlock) {
      const text = firstTextBlock.data.text || firstTextBlock.data.caption || '';
      // Strip HTML tags and limit length
      const plainText = text.replace(/<[^>]*>/g, '');
      return plainText.length > 150 ? plainText.slice(0, 150) + '...' : plainText;
    }
    
    return 'Пустая идея';
  };

  return (
    <Container size="xl">
      <div className="py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-3">💡 Идеи</h1>
            <p className="text-lg text-text-secondary">
              Записывайте свои идеи и мысли
            </p>
          </div>
          <Button
            onClick={() => navigate('/ideas/new')}
            variant="primary"
            className="bg-gradient-to-r from-accent-yellow to-accent-orange"
          >
            + Новая идея
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по идеям..."
              className="w-full bg-glass-light border border-glass-border rounded-glass-sm px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </Card>

        {/* Ideas Grid */}
        {filteredIdeas.length === 0 ? (
          <Card className="text-center py-16">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {searchQuery ? 'Ничего не найдено' : 'Нет идей'}
            </h3>
            <p className="text-text-secondary mb-6">
              {searchQuery 
                ? 'Попробуйте изменить поисковый запрос'
                : 'Начните записывать свои идеи и мысли'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => navigate('/ideas/new')}
                variant="primary"
                className="bg-gradient-to-r from-accent-yellow to-accent-orange"
              >
                Создать первую идею
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="cursor-pointer"
                onClick={() => navigate(`/ideas/${idea.id}`)}
              >
                <Card
                  variant="gradient"
                  accentColor="orange"
                  className="group hover:shadow-glass-lg transition-all h-full"
                >
                <div className="flex flex-col h-full">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                    {idea.title}
                  </h3>

                  {/* Preview */}
                  <p className="text-sm text-text-secondary mb-4 line-clamp-3 flex-1">
                    {getPreviewText(idea.content)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-glass-border">
                    <span>
                      {format(new Date(idea.updatedAt), 'dd.MM.yyyy HH:mm')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(idea.id, idea.title);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-danger hover:text-danger/80 px-2 py-1 rounded"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {ideas.length > 0 && (
          <div className="mt-8 text-center text-sm text-text-muted">
            {searchQuery
              ? `Найдено: ${filteredIdeas.length} из ${ideas.length}`
              : `Всего идей: ${ideas.length}`}
          </div>
        )}
      </div>
    </Container>
  );
}

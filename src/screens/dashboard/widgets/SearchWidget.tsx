import { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export function SearchWidget() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEngine, setActiveEngine] = useState<'google' | 'youtube'>('google');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = encodeURIComponent(searchQuery.trim());
    const url =
      activeEngine === 'google'
        ? `https://www.google.com/search?q=${query}`
        : `https://www.youtube.com/results?search_query=${query}`;

    window.open(url, '_blank');
    setSearchQuery('');
  };

  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Поиск</h3>

      {/* Engine Selector */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeEngine === 'google' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveEngine('google')}
          className="flex-1"
        >
          Google
        </Button>
        <Button
          variant={activeEngine === 'youtube' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveEngine('youtube')}
          className="flex-1"
        >
          YouTube
        </Button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            activeEngine === 'google' ? 'Искать в Google...' : 'Искать в YouTube...'
          }
          className="flex-1"
        />
        <Button type="submit" variant="primary">
          🔍
        </Button>
      </form>
    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Loader2, Clapperboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GifPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (gifUrl: string, previewUrl: string) => void;
}

interface GifData {
  id: string;
  title: string;
  url: string;
  preview: string;
}

// Use a collection of popular GIFs from Giphy's CDN
// These are direct URLs that don't require API calls
const TRENDING_GIFS: GifData[] = [
  { id: '1', title: 'Applause', url: 'https://media.giphy.com/media/a0h7sAqON67nO/giphy.gif', preview: 'https://media.giphy.com/media/a0h7sAqON67nO/200.gif' },
  { id: '2', title: 'Thumbs Up', url: 'https://media.giphy.com/media/kEtm4mSTbxvH7j3buI/giphy.gif', preview: 'https://media.giphy.com/media/kEtm4mSTbxvH7j3buI/200.gif' },
  { id: '3', title: 'Wow', url: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif', preview: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/200.gif' },
  { id: '4', title: 'Laughing', url: 'https://media.giphy.com/media/dzaUX7CAG0Ahi/giphy.gif', preview: 'https://media.giphy.com/media/dzaUX7CAG0Ahi/200.gif' },
  { id: '5', title: 'Love', url: 'https://media.giphy.com/media/ML1Mgl0PQvYznvfZ55/giphy.gif', preview: 'https://media.giphy.com/media/ML1Mgl0PQvYznvfZ55/200.gif' },
  { id: '6', title: 'Dancing', url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', preview: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/200.gif' },
  { id: '7', title: 'Excited', url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif', preview: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/200.gif' },
  { id: '8', title: 'Shocked', url: 'https://media.giphy.com/media/5VKbvrjlpVcA6wbDoe/giphy.gif', preview: 'https://media.giphy.com/media/5VKbvrjlpVcA6wbDoe/200.gif' },
  { id: '9', title: 'Thinking', url: 'https://media.giphy.com/media/4JVTF9CYRe6p6/giphy.gif', preview: 'https://media.giphy.com/media/4JVTF9CYRe6p6/200.gif' },
  { id: '10', title: 'Sad', url: 'https://media.giphy.com/media/3o7qDKzJh0LLR9OqNq/giphy.gif', preview: 'https://media.giphy.com/media/3o7qDKzJh0LLR9OqNq/200.gif' },
  { id: '11', title: 'Angry', url: 'https://media.giphy.com/media/xeXEpNqf1yPBLuS0Gv/giphy.gif', preview: 'https://media.giphy.com/media/xeXEpNqf1yPBLuS0Gv/200.gif' },
  { id: '12', title: 'Cool', url: 'https://media.giphy.com/media/3o7abB06u9bBz6PglW/giphy.gif', preview: 'https://media.giphy.com/media/3o7abB06u9bBz6PglW/200.gif' },
  { id: '13', title: 'Party', url: 'https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif', preview: 'https://media.giphy.com/media/26BRuo6sLetdllPAQ/200.gif' },
  { id: '14', title: 'Confused', url: 'https://media.giphy.com/media/1qjwAvvT5B9vKnE5O3/giphy.gif', preview: 'https://media.giphy.com/media/1qjwAvvT5B9vKnE5O3/200.gif' },
  { id: '15', title: 'Sleepy', url: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif', preview: 'https://media.giphy.com/media/13HgwGsXF0aiGY/200.gif' },
  { id: '16', title: 'Silly', url: 'https://media.giphy.com/media/3oKIPnAia1t3ZAq9CM/giphy.gif', preview: 'https://media.giphy.com/media/3oKIPnAia1t3ZAq9CM/200.gif' },
  { id: '17', title: 'Nervous', url: 'https://media.giphy.com/media/3o7abK7vOwLOf9v0bG/giphy.gif', preview: 'https://media.giphy.com/media/3o7abK7vOwLOf9v0bG/200.gif' },
  { id: '18', title: 'Proud', url: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif', preview: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/200.gif' },
  { id: '19', title: 'Surprised', url: 'https://media.giphy.com/media/5GoVLqeAOq6nkqO4Ws/giphy.gif', preview: 'https://media.giphy.com/media/5GoVLqeAOq6nkqO4Ws/200.gif' },
  { id: '20', title: 'Bored', url: 'https://media.giphy.com/media/jJxaXrsOkB7W0/giphy.gif', preview: 'https://media.giphy.com/media/jJxaXrsOkB7W0/200.gif' },
];

export function GifPicker({ open, onClose, onSelect }: GifPickerProps) {
  const [search, setSearch] = useState('');
  const [gifs, setGifs] = useState<GifData[]>(TRENDING_GIFS);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filter GIFs by search
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      if (!search.trim()) {
        setGifs(TRENDING_GIFS);
      } else {
        const searchLower = search.toLowerCase();
        const filtered = TRENDING_GIFS.filter(gif => 
          gif.title.toLowerCase().includes(searchLower)
        );
        setGifs(filtered.length > 0 ? filtered : TRENDING_GIFS);
      }
    }, 200);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [search]);

  const handleSelect = (gif: GifData) => {
    onSelect(gif.url, gif.preview);
    onClose();
  };

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setSearch('');
      setGifs(TRENDING_GIFS);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clapperboard className="w-5 h-5" />
            Choose a GIF
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search GIFs..."
              className="pl-9"
            />
          </div>
          <ScrollArea className="h-80">
            {gifs.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 p-1">
                {gifs.map((gif) => (
                  <button
                    key={gif.id}
                    onClick={() => handleSelect(gif)}
                    className="aspect-video rounded-md overflow-hidden hover:opacity-80 transition-opacity bg-secondary"
                  >
                    <img
                      src={gif.preview}
                      alt={gif.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No GIFs found
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
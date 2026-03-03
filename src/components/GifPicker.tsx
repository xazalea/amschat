import { useState, useEffect, useRef, useCallback } from 'react';
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
  images: {
    original: { url: string };
    preview: { url: string };
  };
}

export function GifPicker({ open, onClose, onSelect }: GifPickerProps) {
  const [gifs, setGifs] = useState<GifData[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingRef = useRef(false);

  const fetchGifs = useCallback(async (searchTerm: string, offsetVal: number, append: boolean = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    
    try {
      const limit = 25;
      const endpoint = searchTerm 
        ? `/api/gifs/search?q=${encodeURIComponent(searchTerm)}&offset=${offsetVal}&limit=${limit}`
        : `/api/gifs/trending?offset=${offsetVal}&limit=${limit}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        if (append) {
          setGifs(prev => [...prev, ...data.data]);
        } else {
          setGifs(data.data);
        }
        setHasMore(data.data.length >= limit);
      } else {
        setHasMore(false);
        if (!append) {
          setGifs([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch GIFs:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (open) {
      setOffset(0);
      setGifs([]);
      fetchGifs('', 0, false);
    }
  }, [open, fetchGifs]);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      setOffset(0);
      setGifs([]);
      setHasMore(true);
      fetchGifs(search, 0, false);
    }, 400);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [search, fetchGifs]);

  const handleSelect = (gif: GifData) => {
    onSelect(gif.images.original.url, gif.images.preview.url);
    onClose();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    
    if (scrollBottom < 150 && hasMore && !loadingRef.current) {
      const newOffset = offset + 25;
      setOffset(newOffset);
      fetchGifs(search, newOffset, true);
    }
  };

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
          <ScrollArea className="h-80" onScroll={handleScroll}>
            <div className="grid grid-cols-2 gap-2 p-1">
              {gifs.map((gif) => (
                <button
                  key={gif.id}
                  onClick={() => handleSelect(gif)}
                  className="aspect-video rounded-md overflow-hidden hover:opacity-80 transition-opacity bg-secondary"
                >
                  <img
                    src={gif.images.preview.url}
                    alt={gif.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
            {loading && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}
            {!loading && gifs.length === 0 && (
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

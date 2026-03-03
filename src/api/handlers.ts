import { http, HttpResponse } from 'msw';

// Using Giphy API - works client-side with public beta key
const GIPHY_API_KEY = 'dc6zaTOxFJmzC'; // Public beta key for development

export const handlers = [
  // Trending GIFs
  http.get('/api/gifs/trending', async ({ request }) => {
    const url = new URL(request.url);
    const offset = url.searchParams.get('offset') || '0';
    const limit = url.searchParams.get('limit') || '25';

    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&offset=${offset}&rating=g`
      );
      const data = await response.json();
      
      // Transform to standard format
      const formatted = {
        data: data.data.map((gif: any) => ({
          id: gif.id,
          title: gif.title || 'GIF',
          images: {
            original: { url: gif.images.original.url },
            preview: { url: gif.images.fixed_height_small?.url || gif.images.preview?.url || gif.images.original.url },
          },
        })),
        pagination: data.pagination,
      };
      return HttpResponse.json(formatted);
    } catch (error) {
      console.error('Failed to fetch trending GIFs:', error);
      return HttpResponse.json({ error: 'Failed to fetch trending GIFs', data: [] }, { status: 500 });
    }
  }),

  // Search GIFs
  http.get('/api/gifs/search', async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const offset = url.searchParams.get('offset') || '0';
    const limit = url.searchParams.get('limit') || '25';

    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&rating=g`
      );
      const data = await response.json();
      
      // Transform to standard format
      const formatted = {
        data: data.data.map((gif: any) => ({
          id: gif.id,
          title: gif.title || 'GIF',
          images: {
            original: { url: gif.images.original.url },
            preview: { url: gif.images.fixed_height_small?.url || gif.images.preview?.url || gif.images.original.url },
          },
        })),
        pagination: data.pagination,
      };
      return HttpResponse.json(formatted);
    } catch (error) {
      console.error('Failed to search GIFs:', error);
      return HttpResponse.json({ error: 'Failed to search GIFs', data: [] }, { status: 500 });
    }
  }),
];

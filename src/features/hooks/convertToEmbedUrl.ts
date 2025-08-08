
export const convertToEmbedUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1); // Извлечение ID из пути
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url; // Возвращаем оригинальную ссылку, если она не YouTube/Vimeo
  } catch (e) {
    console.error('Ошибка преобразования URL:', e);
    return url;
  }
};
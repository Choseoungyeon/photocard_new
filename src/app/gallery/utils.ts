export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}. ${month}. ${day}.`;
}

export function ensureHttps(url: string): string {
  if (!url) return url;

  if (url.startsWith('https://')) {
    return url;
  }

  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }

  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  return url;
}

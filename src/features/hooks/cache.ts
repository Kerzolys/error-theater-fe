export function setCache<T>(key: string, data: T, ttlMinutes: number) {
  localStorage.setItem(
    key,
    JSON.stringify({
      data,
      updateAt: Date.now,
      ttl: ttlMinutes * 60 * 1000,
    })
  );
}

export function getCache<T>(key: string): T | null {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.updateAt < parsed.ttl) {
      return parsed.data as T;
    } else {
      localStorage.removeItem(key);
      return null;
    }
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

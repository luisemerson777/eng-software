export const loadJSON = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const saveJSON = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const loadBool = (key, fallback = false) => {
  if (typeof window === 'undefined') return fallback;
  return window.localStorage.getItem(key) === 'true' ? true : fallback;
};

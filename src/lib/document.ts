export const formatDocumentDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getDocumentName = (value?: string): string => {
  if (!value || !value.trim()) return 'Untitled Document';
  return value.trim();
};

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

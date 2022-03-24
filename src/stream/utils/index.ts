export function extractKeyFromPath(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

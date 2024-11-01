export function slugify(
  name: string,
  slug?: string | undefined
): string | undefined {
  return (slug ?? name + ((Math.random() * 1000) | 0))
    .replace(/[^a-zA-z0-9_-]/g, "-")
    .toLowerCase();
}

type ClassValue = string | false | null | undefined;

/** Joins truthy class names together. Minimal stand-in for clsx. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

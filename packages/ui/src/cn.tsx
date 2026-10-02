/**
 * Tiny, dependency-free class name composer.
 *
 * Accepts strings, arrays and conditional maps so component variants can be
 * declared as plain objects without pulling in a utility library.
 */
export type ClassValue =
  | string
  | number
  | bigint
  | null
  | undefined
  | false
  | ClassValue[]
  | { [key: string]: boolean | null | undefined };

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  const walk = (value: ClassValue): void => {
    if (!value && typeof value !== "number" && typeof value !== "bigint") return;

    if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
      classes.push(String(value));
      return;
    }

    if (Array.isArray(value)) {
      for (const item of value) walk(item);
      return;
    }

    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key) && value[key]) {
        classes.push(key);
      }
    }
  };

  for (const input of inputs) walk(input);

  return classes.join(" ");
}
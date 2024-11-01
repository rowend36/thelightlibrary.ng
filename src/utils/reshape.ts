export default function reshape<T extends { [key: string]: any }, V = T>(
  input: T[],
  className?: new () => V,
  allowDuplicate = false // Determines whether duplicates are allowed (cannot be used with joins)
): V[] {
  if (!input.length) return [];

  const output: V[] = [];
  // Determine the unique key based on the first object's key
  const uniqueKey = Object.keys(input[0])[0];
  let last: V | undefined; // Keeps track of the last inserted element to avoid duplication

  for (const element of input) {
    // If duplicates are not allowed and the last object has the same unique key, reuse the last object
    const newObject: V =
      !allowDuplicate &&
      last &&
      uniqueKey &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (last as any)[uniqueKey] === element[uniqueKey]
        ? last
        : new (className || (element.constructor as new () => V))(); // Create a new instance using the className or default constructor

    for (const key in element) {
      if (!insert(key, element[key], newObject)) {
        throw new Error(
          `Duplicate key '${key}'. Did you forget an array syntax or fail to provide a unique key?`
        );
      }
    }

    if (newObject !== last) {
      last = newObject;
      output.push(newObject);
    }
  }

  return output;
}

/**
 * Inserts a value into an object based on the provided key.
 * Handles nested keys and array syntax (e.g., key.subkey, key[], etc.).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function insert(key: string, value: any, obj: any): boolean {
  if ((typeof obj !== "object" || obj === null) && value !== null) {
    throw new Error(
      `Cannot insert column '${key}' into non-object or null (current value: ${obj})`
    );
  }

  // Handle array syntax (e.g., key[])
  if (/^(\w+)\[\w*\]/.test(key)) {
    const [, name, rest] = key.split(/^(\w+)\[\w*\](.*)/);
    if (!obj[name]) obj[name] = [];

    if (rest) {
      if (rest[0] !== ".")
        throw new Error(`Parsing error in array key: '${rest}'`);

      const lastArrayElement = obj[name][obj[name].length - 1];
      if (lastArrayElement && insert(rest.slice(1), value, lastArrayElement))
        return true;

      if (lastArrayElement === undefined && value === null) return true; // Skip if both are undefined

      const newArrayItem = {};
      insert(rest.slice(1), value, newArrayItem);
      obj[name].push(newArrayItem);
      return true;
    } else {
      if (value !== null) obj[name].push(value);
      return true;
    }
  }

  // Handle nested object syntax (e.g., key.subkey)
  else if (/^(\w+)\./.test(key)) {
    const [, name, rest] = key.split(/^(\w+)\.(.*)/);
    if (!obj[name]) obj[name] = {};

    return insert(rest, value, obj[name]);
  }

  // Handle simple key-value assignment
  else {
    if (key in obj) {
      if (
        value === obj[key] ||
        (value instanceof Date &&
          obj[key] instanceof Date &&
          value.valueOf() === obj[key].valueOf())
      )
        return true;
      return false;
    }
    obj[key] = value;
    return true;
  }
}

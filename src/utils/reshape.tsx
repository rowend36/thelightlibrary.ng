export default function reshape<T extends { [key: string]: any }, V = T>(
  input: T[],
  className?: new () => V,
  allowDuplicate = false // Cannot be used wth joins
): V[] {
  if (!input.length) return [];

  const output: V[] = [];
  const unique = Object.keys(input[0])[0];
  let last: V | undefined;
  for (let e of input) {
    let newCtx: V =
      !allowDuplicate && last && unique && (last as any)[unique] === e[unique]
        ? last
        : new (className ||
            (e.constructor as unknown as Exclude<
              typeof className,
              undefined
            >))();

    for (let key in e) {
      if (!insert(key, e[key], newCtx))
        throw new Error(
          "Duplicate key " +
            key +
            ". Are you missing an array syntax or failing to provide a unique key as the first selection? "
        );
    }
    if (newCtx !== last) {
      last = newCtx;
      output.push(newCtx);
    }
  }
  return output;
}

function insert(key: string, value: any, obj: any): boolean {
  if ((typeof obj !== "object" || obj === null) && value !== null) {
    throw new Error(
      "Cannot insert column '" + key + "' in " + typeof obj + "(" + obj + ")"
    );
  }
  // Array syntax
  if (/^(\w+)\[\]/.test(key)) {
    const [, name, rest] = key.split(/^(\w+)\[\](.*)/);
    if (!obj[name]) obj[name] = [];
    if (rest) {
      if (rest[0] !== ".") throw new Error("Parsing error =>" + rest);
      const ctx = obj[name][obj[name].length - 1];
      if (ctx === undefined || !insert(rest.slice(1), value, ctx)) {
        if (ctx === undefined && value === null) return true;
        const newCtx = {};
        insert(rest.slice(1), value, newCtx);
        obj[name].push(newCtx);
      }
    } else {
      obj[name].push(value);
    }
  }
  // Object Syntax
  else if (/^(\w+)\./.test(key)) {
    const [, name, rest] = key.split(/^(\w+)\.(.*)/);
    if (!obj[name]) obj[name] = {};
    if (rest) {
      const ctx = obj[name];
      return insert(rest, value, ctx);
    }
  }
  // Key Syntax
  else {
    if (key in obj) {
      if (value === obj[key]) return true;
      else return false;
    }
    obj[key] = value;
  }
  return true;
}

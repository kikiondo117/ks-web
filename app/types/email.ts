export function assertNever(value: never): never {
  throw new Error("Unsupported form type:", value);
}

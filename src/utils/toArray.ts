export function stringToArray(
  separator: string,
  str: string | string[]
): string[] {
  return typeof str === "string"
    ? str.split(separator).map(item => item.trim())
    : str;
}

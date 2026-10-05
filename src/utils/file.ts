export async function readTextFile(path: string): Promise<string> {
  return await Bun.file(path).text();
}

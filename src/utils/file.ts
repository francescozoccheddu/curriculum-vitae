export async function readTextFile(path: string): Promise<string> {
  return await Bun.file(path).text();
}

export async function writeTextFile(
  path: string,
  content: string,
): Promise<void> {
  await Bun.write(path, content);
}

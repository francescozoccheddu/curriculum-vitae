export async function readTextFile(file: string): Promise<string> {
  return await Bun.file(file).text();
}

export async function writeTextFile(
  file: string,
  content: string,
): Promise<void> {
  await Bun.write(file, content);
}

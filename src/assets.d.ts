declare module "*.svg" {
  const path: string;
  // biome-ignore lint/style/noDefaultExport: asset modules default export file paths
  export default path;
}

declare module "*.ttf" {
  const path: string;
  // biome-ignore lint/style/noDefaultExport: asset modules default export file paths
  export default path;
}

declare module "*.html" {
  const bundle: Bun.HTMLBundle;
  // biome-ignore lint/style/noDefaultExport: HTML bundle default export
  export default bundle;
}

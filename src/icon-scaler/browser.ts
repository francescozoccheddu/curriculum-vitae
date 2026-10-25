import open, { apps, openApp } from "open";

export async function openAppWindow(url: string): Promise<void> {
  await openApp(apps.chrome, {
    wait: true,
    arguments: [
      `--app=${url}`,
      "--user-data-dir=/tmp/icon-scaler-profile",
      "--no-first-run",
      "--no-default-browser-check",
    ],
  }).catch(() => open(url, { wait: true }));
}

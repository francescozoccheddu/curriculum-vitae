import { openAppWindow } from "@/icon-scaler/browser";
import { loadIconItems, saveUpdatedViewBoxes } from "@/icon-scaler/icons";
import indexHtml from "@/icon-scaler/public/index.html";

export async function scaleIcons(descriptorFile: string): Promise<number> {
  const items = await loadIconItems(descriptorFile);
  if (items.length === 0) {
    return 0;
  }

  const modifiedMap = new Map<string, { filePath: string; viewBox: string }>();

  return await new Promise<number>((resolvePromise, rejectPromise) => {
    let isFinished = false;

    const finish = async () => {
      if (isFinished) return;
      isFinished = true;
      server.stop();
      try {
        const count = await saveUpdatedViewBoxes(modifiedMap);
        resolvePromise(count);
      } catch (error) {
        rejectPromise(error);
      }
    };

    const server = Bun.serve({
      port: 0,
      routes: {
        "/": indexHtml,
        "/api/items": () => Response.json(items),
      },
      websocket: {
        message(_ws, message) {
          try {
            const data = JSON.parse(message.toString());
            if (data.id && data.filePath && data.viewBox) {
              modifiedMap.set(data.id, {
                filePath: data.filePath,
                viewBox: data.viewBox,
              });
            }
          } catch {
            // ignore malformed message
          }
        },
        close() {
          void finish();
        },
      },
      fetch(req, srv) {
        if (srv.upgrade(req)) {
          return undefined;
        }
        return new Response("Not Found", { status: 404 });
      },
    });

    void openAppWindow(`http://localhost:${server.port}`).then(() => {
      setTimeout(() => {
        void finish();
      }, 300);
    });

    process.once("SIGINT", () => {
      void finish();
    });
    process.once("SIGTERM", () => {
      void finish();
    });
  });
}

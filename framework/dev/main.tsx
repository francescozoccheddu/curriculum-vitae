import { PDFViewer } from "@react-pdf/renderer";
import { Content } from "content/Content";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "framework/dev/style.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing #root element");
createRoot(rootEl).render(
  <StrictMode>
    <PDFViewer className="pdf-viewer">
      <Content />
    </PDFViewer>
  </StrictMode>,
);

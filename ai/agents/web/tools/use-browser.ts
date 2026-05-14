import { tool } from "ai";
import { getAnchorApiKey, saveArtifact } from "./core";
import { useBrowserSchema } from "./schema";
import {
  connectToAnchorSession,
  endAnchorSession,
  startAnchorSession,
} from "./services/anchor";

export const useBrowserTool = tool({
  description: "Start a browser session and execute web tasks using Anchor Browser.",
  inputSchema: useBrowserSchema,
  execute: async ({ task, initialUrl }) => {
    const anchorApiKey = getAnchorApiKey();
    const session = await startAnchorSession(anchorApiKey, {
      initialUrl,
      headless: false,
    });

    try {
      const browser = await connectToAnchorSession(anchorApiKey, session.id);
      const context = browser.contexts()[0];
      const page = context.pages()[0];
      await page.goto(initialUrl, { waitUntil: "domcontentloaded" });

      const ai = context.serviceWorkers()[0];
      const result = await ai.evaluate(task);

      const sessionPayload = {
        type: "browser-session",
        sessionId: session.id,
        cdpUrl: session.cdp_url,
        liveViewUrl: session.live_view_url,
        task,
        initialUrl,
        headless: false,
        createdAt: new Date().toISOString(),
        result,
        status: "completed",
      };

      const relativePath = saveArtifact("browser", `${session.id}.browser.json`, sessionPayload);

      await browser.close();
      await endAnchorSession(anchorApiKey, session.id);

      return {
        success: true,
        result,
        artifact_path: relativePath,
        message: `Browser task completed. Live view: ${session.live_view_url}`,
      };
    } catch (error) {
      await endAnchorSession(anchorApiKey, session.id);

      return {
        success: false,
        error: `Error executing browser task: ${(error as Error)?.message || error}`,
      };
    }
  },
});

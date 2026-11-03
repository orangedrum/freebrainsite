import { handlePilotSignup } from "./src/lib/pilotSignupApi";
import type { Plugin } from "vite";
import { loadEnv } from "vite";

export const pilotSignupDevApi = (mode: string): Plugin => ({
  name: "pilot-signup-dev-api",
  apply: "serve",
  configureServer(server) {
    const env = loadEnv(mode, process.cwd(), "");
    if (!process.env.RESEND_API_KEY && env.RESEND_API_KEY) {
      process.env.RESEND_API_KEY = env.RESEND_API_KEY;
    }

    server.middlewares.use(async (request, response, next) => {
      const requestUrl = request.url ?? "";
      if (new URL(requestUrl, "http://localhost").pathname !== "/api/pilot-signup") {
        next();
        return;
      }

      try {
        const chunks: Buffer[] = [];
        for await (const chunk of request) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }

        const headers = new Headers();
        for (const [name, value] of Object.entries(request.headers)) {
          if (Array.isArray(value)) {
            for (const item of value) headers.append(name, item);
          } else if (value !== undefined) {
            headers.set(name, value);
          }
        }
        if (!headers.has("x-real-ip") && request.socket.remoteAddress) {
          headers.set("x-real-ip", request.socket.remoteAddress);
        }

        const host = request.headers.host ?? "localhost";
        const method = request.method ?? "GET";
        const body = Buffer.concat(chunks).toString("utf8");
        const apiRequest = new Request(`http://${host}${requestUrl}`, {
          method,
          headers,
          body: method === "GET" || method === "HEAD" ? undefined : body,
        });
        const apiResponse = await handlePilotSignup(apiRequest);
        response.statusCode = apiResponse.status;
        apiResponse.headers.forEach((value, name) => response.setHeader(name, value));
        response.end(Buffer.from(await apiResponse.arrayBuffer()));
      } catch (error) {
        next(error);
      }
    });
  },
});

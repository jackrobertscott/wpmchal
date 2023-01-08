import http from "http";
import { config } from "./config";
import { serve, RequestHandler } from "micro";
/**
 *
 */
const addCORSHeaders = (handler: RequestHandler): RequestHandler => {
  return (req, res) => {
    const allowedAge = 60 * 60 * 24; // 24 hours
    const allowedMethods = ["POST", "OPTIONS"];
    const allowedHeaders = [
      "Access-Control-Allow-Origin",
      "Content-Type",
      "Authorization",
      "Accept",
    ];
    // change '*' from wildcard to your url when in production
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", allowedMethods.join(","));
    res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(","));
    res.setHeader("Access-Control-Max-Age", String(allowedAge));
    return handler(req, res);
  };
};
/**
 *
 */
const api: RequestHandler = (req, res) => {
  console.log(req.method, req.url);
  if (req.method === "OPTIONS") return {};
  switch (req.url) {
    case "/robots.txt":
    case "/favicon.ico":
      return null;
    case "/":
      return { now: Date.now() };
    case "/say-hello":
      return { message: "Hello Jack" };
  }
};
/**
 *
 */
const server = new http.Server(serve(addCORSHeaders(api)));
/**
 *
 */
server.listen(config.port, () => {
  console.log(`1️⃣  Server: http://localhost:${config.port}`);
});

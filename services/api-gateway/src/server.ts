import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL ?? "http://localhost:3001/users",
    changeOrigin: true,
  }),
);

app.use(
  "/api/products",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL ?? "http://localhost:3002/products",
    changeOrigin: true,
  }),
);

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL ?? "http://localhost:3003/orders",
    changeOrigin: true,
  }),
);

app.get("/health", (req, res) => {
  res.send("API Gateway is running");
});

app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});

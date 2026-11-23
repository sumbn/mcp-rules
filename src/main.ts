import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import type { Express } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { AppModule } from './app.module.js';

/**
 * main.ts — Dual-mode entry point
 *
 * - Local development: NestJS lắng nghe trên PORT (mặc định 3000)
 * - Vercel Serverless: Export handler function, app instance được cache lại
 *   giữa các invocation để tránh cold start penalty.
 */

// Cache Express app instance giữa các serverless invocation
let cachedExpressApp: Express | null = null;

/**
 * Khởi tạo NestJS app với Express adapter.
 * Kết quả được cache lại cho các lần gọi tiếp theo trên Vercel.
 */
async function bootstrapServer(): Promise<Express> {
  if (cachedExpressApp) {
    return cachedExpressApp;
  }

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'mcp-session-id'],
    exposedHeaders: ['mcp-session-id'],
  });

  await app.init();

  cachedExpressApp = expressApp;
  return expressApp;
}

// ─── Vercel Serverless Handler ───────────────────────────────────────────────
// Vercel sẽ import file này và gọi default export như một HTTP handler.
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const server = await bootstrapServer();
  server(req, res);
}

// ─── Local Development ────────────────────────────────────────────────────────
// Chỉ chạy khi không phải môi trường Vercel serverless
const isVercel =
  process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

if (!isVercel) {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose'],
  });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'mcp-session-id'],
    exposedHeaders: ['mcp-session-id'],
  });

  await app.listen(port);
  console.log(`\n🚀 MCP Server đang chạy tại: http://localhost:${port}`);
  console.log(`📡 MCP Endpoint: http://localhost:${port}/mcp`);
  console.log(
    `🔐 Auth: ${process.env.MCP_AUTH_ENABLED === 'true' ? 'BẬT' : 'TẮT'}\n`,
  );
}

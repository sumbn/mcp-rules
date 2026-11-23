import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module.js';
let cachedExpressApp = null;
async function bootstrapServer() {
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
export default async function handler(req, res) {
    const server = await bootstrapServer();
    server(req, res);
}
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;
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
    console.log(`🔐 Auth: ${process.env.MCP_AUTH_ENABLED === 'true' ? 'BẬT' : 'TẮT'}\n`);
}
//# sourceMappingURL=main.js.map
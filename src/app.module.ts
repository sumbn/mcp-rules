import { Module, UseGuards } from '@nestjs/common';
import { McpModule } from '@nestjs/mcp';
import { AuthModule } from './auth/auth.module.js';
import { AuthGuard } from './auth/auth.guard.js';
import { GithubConfigModule } from './github-config/github-config.module.js';
import { GoogleDocsModule } from './google-docs/google-docs.module.js';
import { McpToolsModule } from './mcp-tools/mcp-tools.module.js';

@Module({
  imports: [
    /**
     * McpModule — Cài đặt MCP server với Streamable HTTP Transport.
     * Endpoint: POST /mcp
     *
     * decorators: Áp dụng AuthGuard lên controller MCP.
     * AuthGuard tự bật/tắt dựa trên MCP_AUTH_ENABLED env variable.
     */
    McpModule.forRoot({
      name: 'google-docs-mcp-server',
      version: '1.0.0',
      description:
        'MCP Server đọc nội dung từ Google Docs và các tài nguyên được cấu hình.',
      path: 'mcp',
      decorators: [UseGuards(AuthGuard)],
      imports: [AuthModule],
    }),
    AuthModule,
    GithubConfigModule,
    GoogleDocsModule,
    McpToolsModule,
  ],
})
export class AppModule {}

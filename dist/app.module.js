var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module, UseGuards } from '@nestjs/common';
import { McpModule } from '@nestjs/mcp';
import { AuthModule } from './auth/auth.module.js';
import { AuthGuard } from './auth/auth.guard.js';
import { GithubConfigModule } from './github-config/github-config.module.js';
import { GoogleDocsModule } from './google-docs/google-docs.module.js';
import { McpToolsModule } from './mcp-tools/mcp-tools.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            McpModule.forRoot({
                name: 'google-docs-mcp-server',
                version: '1.0.0',
                description: 'MCP Server đọc nội dung từ Google Docs và các tài nguyên được cấu hình.',
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { GithubConfigModule } from '../github-config/github-config.module.js';
import { GoogleDocsModule } from '../google-docs/google-docs.module.js';
import { GetGoogleDocTool } from './get-google-doc.tool.js';
import { GetNoteTool } from './get-note.tool.js';
import { GetResourceTool } from './get-resource.tool.js';
import { ReadDocFromUrlTool } from './read-doc-from-url.tool.js';
import { ReadDocFromConfigTool } from './read-doc-from-config.tool.js';
let McpToolsModule = class McpToolsModule {
};
McpToolsModule = __decorate([
    Module({
        imports: [GithubConfigModule, GoogleDocsModule],
        providers: [
            GetGoogleDocTool,
            GetNoteTool,
            GetResourceTool,
            ReadDocFromUrlTool,
            ReadDocFromConfigTool,
        ],
    })
], McpToolsModule);
export { McpToolsModule };
//# sourceMappingURL=mcp-tools.module.js.map
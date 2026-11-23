import { Module } from '@nestjs/common';
import { GithubConfigModule } from '../github-config/github-config.module.js';
import { GoogleDocsModule } from '../google-docs/google-docs.module.js';
import { GetGoogleDocTool } from './get-google-doc.tool.js';
import { GetNoteTool } from './get-note.tool.js';
import { GetResourceTool } from './get-resource.tool.js';
import { ReadDocFromUrlTool } from './read-doc-from-url.tool.js';
import { ReadDocFromConfigTool } from './read-doc-from-config.tool.js';

@Module({
  imports: [GithubConfigModule, GoogleDocsModule],
  providers: [
    GetGoogleDocTool,
    GetNoteTool,
    GetResourceTool,
    ReadDocFromUrlTool,
    ReadDocFromConfigTool,
  ],
})
export class McpToolsModule {}

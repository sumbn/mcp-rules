import { Module } from '@nestjs/common';
import type { Provider } from '@nestjs/common';
import { GithubConfigModule } from '../github-config/github-config.module.js';
import { GoogleDocsModule } from '../google-docs/google-docs.module.js';
import { GetGoogleDocTool } from './get-google-doc.tool.js';
import { GetGoogleDoc2Tool } from './get-google-doc-2.tool.js';
import { GetNoteTool } from './get-note.tool.js';
import { GetResourceTool } from './get-resource.tool.js';
import { ReadDocFromUrlTool } from './read-doc-from-url.tool.js';
import { ReadDocFromConfigTool } from './read-doc-from-config.tool.js';
import { TOOL_FLAGS } from '../config/external-links.js';

/**
 * Danh sách providers được đăng ký có điều kiện theo TOOL_FLAGS.
 *
 * Tool nào có flag = false sẽ KHÔNG được đưa vào providers[],
 * do đó @nestjs/mcp sẽ không bao giờ quét thấy và đăng ký tool đó
 * vào MCP server — tool hoàn toàn vô hình với MCP client.
 */
const conditionalProviders: Provider[] = [
  ...(TOOL_FLAGS.GET_GOOGLE_DOC ? [GetGoogleDocTool] : []),
  ...(TOOL_FLAGS.GET_GOOGLE_DOC_2 ? [GetGoogleDoc2Tool] : []),
  ...(TOOL_FLAGS.GET_NOTE ? [GetNoteTool] : []),
  ...(TOOL_FLAGS.GET_RESOURCE ? [GetResourceTool] : []),
  ...(TOOL_FLAGS.READ_DOC_FROM_URL ? [ReadDocFromUrlTool] : []),
  ...(TOOL_FLAGS.READ_DOC_FROM_CONFIG ? [ReadDocFromConfigTool] : []),
];

@Module({
  imports: [GithubConfigModule, GoogleDocsModule],
  providers: conditionalProviders,
})
export class McpToolsModule {}

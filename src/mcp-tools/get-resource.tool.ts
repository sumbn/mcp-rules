import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import { z } from 'zod';
import { GithubConfigService } from '../github-config/github-config.service.js';
import { GoogleDocsService } from '../google-docs/google-docs.service.js';
import { TOOL_FLAGS } from '../config/external-links.js';

/**
 * GetResourceTool — Lấy nội dung theo resource_key từ data.json → "resources".
 *
 * Cần truyền tham số resource_key. URL tương ứng được tra cứu trong data.json:
 *   { "resources": { "my_key": "https://example.com/content.txt" } }
 *
 * Thêm/sửa/xóa key trong data.json → backend tự nhận mà không cần deploy lại.
 *
 * Bật/tắt: TOOL_FLAGS.GET_RESOURCE trong src/config/external-links.ts
 */
@Injectable()
export class GetResourceTool {
  constructor(
    private readonly githubConfigService: GithubConfigService,
    private readonly googleDocsService: GoogleDocsService,
  ) {}

  @Tool({
    name: 'get_resource',
    description:
      'Lấy nội dung tài nguyên theo tên key được cấu hình trong hệ thống. ' +
      'Truyền resource_key để tra cứu URL tương ứng trong trường "resources" của file data.json trên GitHub. ' +
      'Ví dụ: resource_key="guide" sẽ lấy nội dung từ resources["guide"]. ' +
      'Danh sách key hợp lệ được quản lý trong data.json — có thể thêm/sửa mà không cần deploy lại server.',
    inputSchema: z.object({
      resource_key: z
        .string()
        .min(1, 'resource_key không được để trống')
        .describe(
          'Tên key của tài nguyên cần lấy, được định nghĩa trong data.json → "resources". ' +
            'Ví dụ: "guide", "faq", "policy".',
        ),
    }),
  })
  async getResource({
    resource_key,
  }: {
    resource_key: string;
  }): Promise<string> {
    if (!TOOL_FLAGS.GET_RESOURCE) {
      return '[Tool get_resource đang bị tắt. Liên hệ quản trị viên để bật lại.]';
    }

    // Tra cứu URL từ data.json → resources[resource_key]
    const url = await this.githubConfigService.getResourceUrl(resource_key);

    // Fetch nội dung từ URL đó
    return this.googleDocsService.fetchUrl(url);
  }
}

import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import { GithubConfigService } from '../github-config/github-config.service.js';
import { GoogleDocsService } from '../google-docs/google-docs.service.js';
import { TOOL_FLAGS } from '../config/external-links.js';

/**
 * GetNoteTool — Lấy nội dung từ URL được cấu hình trong data.json → "note_link".
 *
 * Không cần tham số. URL được quản lý hoàn toàn trong data.json trên GitHub.
 * Thay đổi "note_link" trong data.json → backend tự nhận ở lần gọi tiếp theo.
 *
 * Bật/tắt: TOOL_FLAGS.GET_NOTE trong src/config/external-links.ts
 */
@Injectable()
export class GetNoteTool {
  constructor(
    private readonly githubConfigService: GithubConfigService,
    private readonly googleDocsService: GoogleDocsService,
  ) {}

  @Tool({
    name: 'get_note',
    description:
      'Lấy nội dung ghi chú / tài liệu mặc định được cấu hình sẵn trong hệ thống. ' +
      'Không cần truyền tham số. ' +
      'URL nguồn được lấy từ trường "note_link" trong file data.json trên GitHub — ' +
      'có thể thay đổi URL bất kỳ lúc nào mà không cần deploy lại server.',
  })
  async getNote(): Promise<string> {
    if (!TOOL_FLAGS.GET_NOTE) {
      return '[Tool get_note đang bị tắt. Liên hệ quản trị viên để bật lại.]';
    }

    // Lấy URL từ data.json → "note_link"
    const url = await this.githubConfigService.getNoteLink();

    // Fetch nội dung từ URL đó
    return this.googleDocsService.fetchUrl(url);
  }
}

import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import { GithubConfigService } from '../github-config/github-config.service.js';
import { GoogleDocsService } from '../google-docs/google-docs.service.js';

/**
 * GetMdFileTool — Đọc nội dung file Markdown từ URL được cấu hình trong
 * data.json → "md_link" trên GitHub.
 *
 * Trả toàn bộ nội dung kèm số dòng để AI phân tích cấu trúc tài liệu
 * và đề xuất các search/replace snippet chính xác khi chỉnh sửa file .md
 * cục bộ trong VSCode.
 *
 * URL được quản lý hoàn toàn trong data.json — thay đổi trên GitHub,
 * backend tự nhận ở lần gọi tiếp theo mà không cần deploy lại.
 *
 * Bật/tắt: TOOL_FLAGS.GET_MD_FILE trong src/config/external-links.ts
 * Khi flag = false, tool này sẽ không được đăng ký vào MCP server
 * (xem mcp-tools.module.ts).
 */
@Injectable()
export class GetMdFileTool {
  constructor(
    private readonly githubConfigService: GithubConfigService,
    private readonly googleDocsService: GoogleDocsService,
  ) {}

  @Tool({
    name: 'get_md_file',
    description:
      'Đọc toàn bộ nội dung file Markdown thứ nhất được cấu hình trong hệ thống. ' +
      'Không cần truyền tham số. ' +
      'URL nguồn được lấy từ trường "md_link" trong file data.json trên GitHub — ' +
      'có thể thay đổi URL bất kỳ lúc nào mà không cần deploy lại server. ' +
      'Trả nội dung đầy đủ có đánh số dòng để AI phân tích cấu trúc ' +
      'và đề xuất các search/replace snippet chính xác khi chỉnh sửa file .md trong VSCode.',
  })
  async getMdFile(): Promise<string> {
    // Lấy URL file markdown từ data.json → "md_link"
    const url = await this.githubConfigService.getMdLink();

    // Fetch toàn bộ nội dung file markdown (plain text, không xử lý Google Docs)
    const content = await this.googleDocsService.fetchUrl(url);

    // Thêm số dòng vào từng dòng để AI dễ tham chiếu khi đề xuất snippet
    return addLineNumbers(content);
  }
}

/**
 * Thêm số dòng vào từng dòng nội dung.
 * Format: "   1 | nội dung dòng"
 */
function addLineNumbers(content: string): string {
  const lines = content.split('\n');
  const width = String(lines.length).length;
  return lines
    .map((line, i) => `${String(i + 1).padStart(width, ' ')} | ${line}`)
    .join('\n');
}

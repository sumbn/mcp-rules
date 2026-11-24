import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import { GoogleDocsService } from '../google-docs/google-docs.service.js';
import { GithubConfigService } from '../github-config/github-config.service.js';


/**
 * ReadDocFromConfigTool — Đọc Google Doc từ URL được cấu hình trong data.json ("link"),
 * trả nội dung có số dòng để AI đề xuất search/replace cho file .md trong VSCode.
 *
 * Không cần truyền tham số. URL được lấy tự động từ data.json trên GitHub —
 * thay đổi "link" trong data.json là backend tự nhận ở lần gọi tiếp theo.
 *
 * Khác với get_google_doc: tool này KHÔNG trả raw text mà trả nội dung
 * đã được đánh số dòng + hướng dẫn định dạng để AI hiểu đúng cấu trúc
 * và tạo ra snippet search/replace chính xác dùng được ngay trong VSCode.
 *
 * Bật/tắt: TOOL_FLAGS.READ_DOC_FROM_CONFIG trong src/config/external-links.ts
 * Khi flag = false, tool này sẽ không được đăng ký vào MCP server
 * (xem mcp-tools.module.ts).
 */
@Injectable()
export class ReadDocFromConfigTool {
  constructor(
    private readonly googleDocsService: GoogleDocsService,
    private readonly githubConfigService: GithubConfigService,
  ) {}

  @Tool({
    name: 'read_doc_from_config',
    description:
      'Đọc nội dung Google Doc từ URL được cấu hình sẵn trong hệ thống (data.json → "link"). ' +
      'Không cần truyền tham số. ' +
      'Trả về nội dung có đánh số dòng để AI phân tích cấu trúc tài liệu ' +
      'và đề xuất các search/replace snippet chính xác cho file .md cục bộ trong VSCode. ' +
      'Dùng tool này khi muốn so sánh hoặc đồng bộ nội dung giữa tài liệu mặc định và file .md.',
  })
  async readDocFromConfig(): Promise<string> {
    // Lấy URL từ data.json → "link"
    const docUrl = await this.githubConfigService.getGoogleDocLink();

    // Fetch nội dung tài liệu
    return this.googleDocsService.fetchDocument(docUrl);
  }
}

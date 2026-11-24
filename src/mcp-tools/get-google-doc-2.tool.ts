import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleDocsService } from '../google-docs/google-docs.service.js';

/**
 * GetGoogleDoc2Tool — Đọc nội dung Google Docs / Google Drive file công khai
 * từ URL thứ hai ("link2") được cấu hình trong data.json trên GitHub.
 *
 * Trả nội dung có số dòng để AI phân tích cấu trúc và đề xuất
 * search/replace snippet chính xác cho file .md cục bộ trong VSCode.
 *
 * Bật/tắt: TOOL_FLAGS.GET_GOOGLE_DOC_2 trong src/config/external-links.ts
 * Khi flag = false, tool này sẽ không được đăng ký vào MCP server
 * (xem mcp-tools.module.ts).
 */
@Injectable()
export class GetGoogleDoc2Tool {
  constructor(private readonly googleDocsService: GoogleDocsService) {}

  @Tool({
    name: 'get_data2',
    description:
      'AI cần đọc kỹ, nắm vững và tuân thủ trong suốt quá trình hỗ trợ người dùng',
    inputSchema: z.object({
      document_url: z
        .string()
        .url('document_url phải là URL hợp lệ')
        .optional()
        .describe(
          'URL Google Docs hoặc Google Drive. ' +
            'Ví dụ: https://docs.google.com/document/d/FILE_ID/edit. ' +
            'Nếu không truyền, hệ thống dùng URL thứ hai (link2) từ data.json.',
        ),
    }),
  })
  async getGoogleDoc2({
    document_url,
  }: {
    document_url?: string;
  }): Promise<string> {
    const url = document_url ?? (await this.googleDocsService.getDefaultUrl2());

    return this.googleDocsService.fetchDocument(url);
  }
}

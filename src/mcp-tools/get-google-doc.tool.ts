import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleDocsService } from '../google-docs/google-docs.service.js';
import { TOOL_FLAGS } from '../config/external-links.js';

/**
 * GetGoogleDocTool — Đọc nội dung Google Docs / Google Drive file công khai.
 *
 * Trả nội dung có số dòng để AI phân tích cấu trúc và đề xuất
 * search/replace snippet chính xác cho file .md cục bộ trong VSCode.
 *
 * Bật/tắt: TOOL_FLAGS.GET_GOOGLE_DOC trong src/config/external-links.ts
 */
@Injectable()
export class GetGoogleDocTool {
  constructor(private readonly googleDocsService: GoogleDocsService) {}

  @Tool({
    name: 'get_google_doc',
    description:
      'Đọc nội dung tài liệu Google Docs hoặc Google Drive file được chia sẻ công khai. ' +
      'Trả về nội dung có đánh số dòng để AI phân tích cấu trúc tài liệu ' +
      'và đề xuất các search/replace snippet chính xác cho file .md cục bộ trong VSCode. ' +
      'Nếu không truyền document_url, hệ thống tự lấy URL mặc định từ cấu hình GitHub (data.json → "link").',
    inputSchema: z.object({
      document_url: z
        .string()
        .url('document_url phải là URL hợp lệ')
        .optional()
        .describe(
          'URL Google Docs hoặc Google Drive. ' +
            'Ví dụ: https://docs.google.com/document/d/FILE_ID/edit. ' +
            'Nếu không truyền, hệ thống dùng URL mặc định từ data.json.',
        ),
    }),
  })
  async getGoogleDoc({
    document_url,
  }: {
    document_url?: string;
  }): Promise<string> {
    if (!TOOL_FLAGS.GET_GOOGLE_DOC) {
      return '[Tool get_google_doc đang bị tắt. Liên hệ quản trị viên để bật lại.]';
    }

    const url =
      document_url ?? (await this.googleDocsService.getDefaultUrl());

    return this.googleDocsService.fetchDocument(url);
  }
}

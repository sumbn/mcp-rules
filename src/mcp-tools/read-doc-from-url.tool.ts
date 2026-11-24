import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleDocsService } from '../google-docs/google-docs.service.js';
import { TOOL_FLAGS } from '../config/external-links.js';

/**
 * ReadDocFromUrlTool — Đọc Google Doc từ URL truyền vào,
 * trả nội dung có số dòng để AI đề xuất search/replace cho file .md trong VSCode.
 *
 * Khác với get_google_doc: tool này KHÔNG trả raw text mà trả nội dung
 * đã được đánh số dòng + hướng dẫn định dạng để AI hiểu đúng cấu trúc
 * và tạo ra snippet search/replace chính xác dùng được ngay trong VSCode.
 *
 * Bật/tắt: TOOL_FLAGS.READ_DOC_FROM_URL trong src/config/external-links.ts
 */
@Injectable()
export class ReadDocFromUrlTool {
  constructor(private readonly googleDocsService: GoogleDocsService) {}

  @Tool({
    name: 'read_doc_from_url',
    description:
      'Đọc nội dung Google Doc từ URL được cung cấp. ' +
      'Trả về nội dung có đánh số dòng để AI phân tích cấu trúc tài liệu ' +
      'và đề xuất các search/replace snippet chính xác cho file .md cục bộ trong VSCode. ' +
      'Dùng tool này khi muốn so sánh hoặc đồng bộ nội dung giữa Google Doc và file .md.',
    inputSchema: z.object({
      document_url: z
        .string()
        .url('document_url phải là URL hợp lệ')
        .describe(
          'URL của Google Docs hoặc Google Drive file được chia sẻ công khai. ' +
            'Ví dụ: https://docs.google.com/document/d/FILE_ID/edit',
        ),
    }),
  })
  async readDocFromUrl({
    document_url,
  }: {
    document_url: string;
  }): Promise<string> {
    if (!TOOL_FLAGS.READ_DOC_FROM_URL) {
      return '[Tool read_doc_from_url đang bị tắt. Liên hệ quản trị viên để bật lại.]';
    }

    return this.googleDocsService.fetchDocument(document_url);
  }
}

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleDocsService } from '../google-docs/google-docs.service.js';
import { TOOL_FLAGS } from '../config/external-links.js';
import { formatWithLineNumbers } from '../common/format-with-line-numbers.util.js';
let ReadDocFromUrlTool = class ReadDocFromUrlTool {
    googleDocsService;
    constructor(googleDocsService) {
        this.googleDocsService = googleDocsService;
    }
    async readDocFromUrl({ document_url, }) {
        if (!TOOL_FLAGS.READ_DOC_FROM_URL) {
            return '[Tool read_doc_from_url đang bị tắt. Liên hệ quản trị viên để bật lại.]';
        }
        const rawContent = await this.googleDocsService.fetchDocument(document_url);
        return formatWithLineNumbers({
            sourceUrl: document_url,
            content: rawContent,
        });
    }
};
__decorate([
    Tool({
        name: 'read_doc_from_url',
        description: 'Đọc nội dung Google Doc từ URL được cung cấp. ' +
            'Trả về nội dung có đánh số dòng để AI phân tích cấu trúc tài liệu ' +
            'và đề xuất các search/replace snippet chính xác cho file .md cục bộ trong VSCode. ' +
            'Dùng tool này khi muốn so sánh hoặc đồng bộ nội dung giữa Google Doc và file .md.',
        inputSchema: z.object({
            document_url: z
                .string()
                .url('document_url phải là URL hợp lệ')
                .describe('URL của Google Docs hoặc Google Drive file được chia sẻ công khai. ' +
                'Ví dụ: https://docs.google.com/document/d/FILE_ID/edit'),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReadDocFromUrlTool.prototype, "readDocFromUrl", null);
ReadDocFromUrlTool = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [GoogleDocsService])
], ReadDocFromUrlTool);
export { ReadDocFromUrlTool };
//# sourceMappingURL=read-doc-from-url.tool.js.map
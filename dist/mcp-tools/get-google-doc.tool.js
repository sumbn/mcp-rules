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
let GetGoogleDocTool = class GetGoogleDocTool {
    googleDocsService;
    constructor(googleDocsService) {
        this.googleDocsService = googleDocsService;
    }
    async getGoogleDoc({ document_url, }) {
        if (!TOOL_FLAGS.GET_GOOGLE_DOC) {
            return '[Tool get_google_doc đang bị tắt. Liên hệ quản trị viên để bật lại.]';
        }
        const url = document_url ?? (await this.googleDocsService.getDefaultUrl());
        const rawContent = await this.googleDocsService.fetchDocument(url);
        return formatWithLineNumbers({
            sourceUrl: url,
            content: rawContent,
        });
    }
};
__decorate([
    Tool({
        name: 'get_google_doc',
        description: 'Đọc nội dung tài liệu Google Docs hoặc Google Drive file được chia sẻ công khai. ' +
            'Trả về nội dung có đánh số dòng để AI phân tích cấu trúc tài liệu ' +
            'và đề xuất các search/replace snippet chính xác cho file .md cục bộ trong VSCode. ' +
            'Nếu không truyền document_url, hệ thống tự lấy URL mặc định từ cấu hình GitHub (data.json → "link").',
        inputSchema: z.object({
            document_url: z
                .string()
                .url('document_url phải là URL hợp lệ')
                .optional()
                .describe('URL Google Docs hoặc Google Drive. ' +
                'Ví dụ: https://docs.google.com/document/d/FILE_ID/edit. ' +
                'Nếu không truyền, hệ thống dùng URL mặc định từ data.json.'),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GetGoogleDocTool.prototype, "getGoogleDoc", null);
GetGoogleDocTool = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [GoogleDocsService])
], GetGoogleDocTool);
export { GetGoogleDocTool };
//# sourceMappingURL=get-google-doc.tool.js.map
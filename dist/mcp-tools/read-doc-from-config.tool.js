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
import { GoogleDocsService } from '../google-docs/google-docs.service.js';
import { GithubConfigService } from '../github-config/github-config.service.js';
import { TOOL_FLAGS } from '../config/external-links.js';
import { formatWithLineNumbers } from '../common/format-with-line-numbers.util.js';
let ReadDocFromConfigTool = class ReadDocFromConfigTool {
    googleDocsService;
    githubConfigService;
    constructor(googleDocsService, githubConfigService) {
        this.googleDocsService = googleDocsService;
        this.githubConfigService = githubConfigService;
    }
    async readDocFromConfig() {
        if (!TOOL_FLAGS.READ_DOC_FROM_CONFIG) {
            return '[Tool read_doc_from_config đang bị tắt. Liên hệ quản trị viên để bật lại.]';
        }
        const docUrl = await this.githubConfigService.getGoogleDocLink();
        const rawContent = await this.googleDocsService.fetchDocument(docUrl);
        return formatWithLineNumbers({
            sourceUrl: docUrl,
            content: rawContent,
        });
    }
};
__decorate([
    Tool({
        name: 'read_doc_from_config',
        description: 'Đọc nội dung Google Doc từ URL được cấu hình sẵn trong hệ thống (data.json → "link"). ' +
            'Không cần truyền tham số. ' +
            'Trả về nội dung có đánh số dòng để AI phân tích cấu trúc tài liệu ' +
            'và đề xuất các search/replace snippet chính xác cho file .md cục bộ trong VSCode. ' +
            'Dùng tool này khi muốn so sánh hoặc đồng bộ nội dung giữa tài liệu mặc định và file .md.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReadDocFromConfigTool.prototype, "readDocFromConfig", null);
ReadDocFromConfigTool = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [GoogleDocsService,
        GithubConfigService])
], ReadDocFromConfigTool);
export { ReadDocFromConfigTool };
//# sourceMappingURL=read-doc-from-config.tool.js.map
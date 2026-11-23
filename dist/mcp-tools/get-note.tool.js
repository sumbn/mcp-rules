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
import { GithubConfigService } from '../github-config/github-config.service.js';
import { GoogleDocsService } from '../google-docs/google-docs.service.js';
import { TOOL_FLAGS } from '../config/external-links.js';
let GetNoteTool = class GetNoteTool {
    githubConfigService;
    googleDocsService;
    constructor(githubConfigService, googleDocsService) {
        this.githubConfigService = githubConfigService;
        this.googleDocsService = googleDocsService;
    }
    async getNote() {
        if (!TOOL_FLAGS.GET_NOTE) {
            return '[Tool get_note đang bị tắt. Liên hệ quản trị viên để bật lại.]';
        }
        const url = await this.githubConfigService.getNoteLink();
        return this.googleDocsService.fetchUrl(url);
    }
};
__decorate([
    Tool({
        name: 'get_note',
        description: 'Lấy nội dung ghi chú / tài liệu mặc định được cấu hình sẵn trong hệ thống. ' +
            'Không cần truyền tham số. ' +
            'URL nguồn được lấy từ trường "note_link" trong file data.json trên GitHub — ' +
            'có thể thay đổi URL bất kỳ lúc nào mà không cần deploy lại server.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GetNoteTool.prototype, "getNote", null);
GetNoteTool = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [GithubConfigService,
        GoogleDocsService])
], GetNoteTool);
export { GetNoteTool };
//# sourceMappingURL=get-note.tool.js.map
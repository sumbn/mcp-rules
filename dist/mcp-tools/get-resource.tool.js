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
import { GithubConfigService } from '../github-config/github-config.service.js';
import { GoogleDocsService } from '../google-docs/google-docs.service.js';
import { TOOL_FLAGS } from '../config/external-links.js';
let GetResourceTool = class GetResourceTool {
    githubConfigService;
    googleDocsService;
    constructor(githubConfigService, googleDocsService) {
        this.githubConfigService = githubConfigService;
        this.googleDocsService = googleDocsService;
    }
    async getResource({ resource_key, }) {
        if (!TOOL_FLAGS.GET_RESOURCE) {
            return '[Tool get_resource đang bị tắt. Liên hệ quản trị viên để bật lại.]';
        }
        const url = await this.githubConfigService.getResourceUrl(resource_key);
        return this.googleDocsService.fetchUrl(url);
    }
};
__decorate([
    Tool({
        name: 'get_resource',
        description: 'Lấy nội dung tài nguyên theo tên key được cấu hình trong hệ thống. ' +
            'Truyền resource_key để tra cứu URL tương ứng trong trường "resources" của file data.json trên GitHub. ' +
            'Ví dụ: resource_key="guide" sẽ lấy nội dung từ resources["guide"]. ' +
            'Danh sách key hợp lệ được quản lý trong data.json — có thể thêm/sửa mà không cần deploy lại server.',
        inputSchema: z.object({
            resource_key: z
                .string()
                .min(1, 'resource_key không được để trống')
                .describe('Tên key của tài nguyên cần lấy, được định nghĩa trong data.json → "resources". ' +
                'Ví dụ: "guide", "faq", "policy".'),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GetResourceTool.prototype, "getResource", null);
GetResourceTool = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [GithubConfigService,
        GoogleDocsService])
], GetResourceTool);
export { GetResourceTool };
//# sourceMappingURL=get-resource.tool.js.map
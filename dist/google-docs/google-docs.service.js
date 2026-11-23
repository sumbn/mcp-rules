var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, InternalServerErrorException, BadRequestException, } from '@nestjs/common';
import axios from 'axios';
import { GithubConfigService } from '../github-config/github-config.service.js';
let GoogleDocsService = class GoogleDocsService {
    githubConfigService;
    HTTP_TIMEOUT_MS = 15_000;
    constructor(githubConfigService) {
        this.githubConfigService = githubConfigService;
    }
    async getDefaultUrl() {
        return this.githubConfigService.getGoogleDocLink();
    }
    async fetchDocument(url) {
        const exportUrl = this.buildExportUrl(url);
        return this.fetchUrl(exportUrl);
    }
    async fetchUrl(url) {
        try {
            const response = await axios.get(url, {
                timeout: this.HTTP_TIMEOUT_MS,
                responseType: 'text',
                maxRedirects: 5,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; MCP-Server/1.0; +https://github.com)',
                },
                validateStatus: (status) => status < 400,
            });
            const content = response.data;
            if (!content || (typeof content === 'string' && content.trim() === '')) {
                throw new InternalServerErrorException('URL trả về nội dung rỗng. Hãy kiểm tra URL có truy cập được không.');
            }
            return typeof content === 'string' ? content : JSON.stringify(content);
        }
        catch (error) {
            if (error instanceof InternalServerErrorException ||
                error instanceof BadRequestException) {
                throw error;
            }
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 403) {
                    throw new BadRequestException('Không có quyền truy cập (403). Hãy đảm bảo tài nguyên được chia sẻ công khai.');
                }
                if (status === 404) {
                    throw new BadRequestException('Không tìm thấy tài nguyên (404). Hãy kiểm tra lại URL.');
                }
                throw new InternalServerErrorException(`Lỗi HTTP ${String(status ?? 'unknown')} khi fetch: ${error.message}`);
            }
            const message = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Không thể fetch nội dung: ${message}`);
        }
    }
    buildExportUrl(url) {
        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        }
        catch {
            throw new BadRequestException(`URL không hợp lệ: "${url}". Hãy truyền một URL đầy đủ hợp lệ.`);
        }
        const { hostname, pathname, searchParams } = parsedUrl;
        if (hostname === 'docs.google.com') {
            const match = pathname.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
            if (match?.[1]) {
                const fileId = match[1];
                return `https://docs.google.com/document/d/${fileId}/export?format=txt`;
            }
        }
        if (hostname === 'drive.google.com') {
            const fileMatch = pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (fileMatch?.[1]) {
                const fileId = fileMatch[1];
                return `https://drive.google.com/uc?export=download&id=${fileId}`;
            }
            const idParam = searchParams.get('id');
            if (idParam) {
                return `https://drive.google.com/uc?export=download&id=${idParam}`;
            }
        }
        throw new BadRequestException(`URL không được nhận dạng: "${url}". Chỉ hỗ trợ Google Docs (docs.google.com) và Google Drive (drive.google.com).`);
    }
};
GoogleDocsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [GithubConfigService])
], GoogleDocsService);
export { GoogleDocsService };
//# sourceMappingURL=google-docs.service.js.map
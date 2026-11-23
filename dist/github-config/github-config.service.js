var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, InternalServerErrorException, } from '@nestjs/common';
import axios from 'axios';
import { EXTERNAL_LINKS } from '../config/external-links.js';
let GithubConfigService = class GithubConfigService {
    HTTP_TIMEOUT_MS = 10_000;
    async fetchConfig() {
        try {
            const response = await axios.get(EXTERNAL_LINKS.github.configJson, { timeout: this.HTTP_TIMEOUT_MS });
            return response.data ?? {};
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Không thể tải file cấu hình từ GitHub: ${message}`);
        }
    }
    async getGoogleDocLink() {
        const config = await this.fetchConfig();
        const link = config.link;
        if (!link || typeof link !== 'string') {
            throw new InternalServerErrorException('data.json không có trường "link" hợp lệ.');
        }
        return link;
    }
    async getNoteLink() {
        const config = await this.fetchConfig();
        const noteLink = config.note_link;
        if (!noteLink || typeof noteLink !== 'string') {
            throw new InternalServerErrorException('data.json không có trường "note_link" hợp lệ. ' +
                'Hãy thêm: { "note_link": "https://..." } vào data.json.');
        }
        return noteLink;
    }
    async getResourceUrl(resourceKey) {
        const config = await this.fetchConfig();
        const resources = config.resources;
        if (!resources || typeof resources !== 'object') {
            throw new InternalServerErrorException('data.json không có trường "resources" hợp lệ. ' +
                'Hãy thêm: { "resources": { "my_key": "https://..." } } vào data.json.');
        }
        const url = resources[resourceKey];
        if (!url || typeof url !== 'string') {
            const availableKeys = Object.keys(resources);
            const keysHint = availableKeys.length > 0
                ? `Các key hiện có: ${availableKeys.join(', ')}.`
                : 'Chưa có key nào được cấu hình trong resources.';
            throw new InternalServerErrorException(`Không tìm thấy key "${resourceKey}" trong resources của data.json. ${keysHint}`);
        }
        return url;
    }
};
GithubConfigService = __decorate([
    Injectable()
], GithubConfigService);
export { GithubConfigService };
//# sourceMappingURL=github-config.service.js.map
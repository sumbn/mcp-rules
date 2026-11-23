import { GithubConfigService } from '../github-config/github-config.service.js';
export declare class GoogleDocsService {
    private readonly githubConfigService;
    private readonly HTTP_TIMEOUT_MS;
    constructor(githubConfigService: GithubConfigService);
    getDefaultUrl(): Promise<string>;
    fetchDocument(url: string): Promise<string>;
    fetchUrl(url: string): Promise<string>;
    private buildExportUrl;
}

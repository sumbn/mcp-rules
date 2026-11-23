import { GithubConfigService } from '../github-config/github-config.service.js';
import { GoogleDocsService } from '../google-docs/google-docs.service.js';
export declare class GetNoteTool {
    private readonly githubConfigService;
    private readonly googleDocsService;
    constructor(githubConfigService: GithubConfigService, googleDocsService: GoogleDocsService);
    getNote(): Promise<string>;
}

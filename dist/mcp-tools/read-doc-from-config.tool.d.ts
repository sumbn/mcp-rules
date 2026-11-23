import { GoogleDocsService } from '../google-docs/google-docs.service.js';
import { GithubConfigService } from '../github-config/github-config.service.js';
export declare class ReadDocFromConfigTool {
    private readonly googleDocsService;
    private readonly githubConfigService;
    constructor(googleDocsService: GoogleDocsService, githubConfigService: GithubConfigService);
    readDocFromConfig(): Promise<string>;
}

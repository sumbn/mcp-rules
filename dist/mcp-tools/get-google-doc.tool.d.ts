import { GoogleDocsService } from '../google-docs/google-docs.service.js';
export declare class GetGoogleDocTool {
    private readonly googleDocsService;
    constructor(googleDocsService: GoogleDocsService);
    getGoogleDoc({ document_url, }: {
        document_url?: string;
    }): Promise<string>;
}

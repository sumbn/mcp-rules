import { GoogleDocsService } from '../google-docs/google-docs.service.js';
export declare class ReadDocFromUrlTool {
    private readonly googleDocsService;
    constructor(googleDocsService: GoogleDocsService);
    readDocFromUrl({ document_url, }: {
        document_url: string;
    }): Promise<string>;
}

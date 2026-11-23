interface GithubConfig {
    link?: string;
    note_link?: string;
    resources?: Record<string, string>;
}
export declare class GithubConfigService {
    private readonly HTTP_TIMEOUT_MS;
    fetchConfig(): Promise<GithubConfig>;
    getGoogleDocLink(): Promise<string>;
    getNoteLink(): Promise<string>;
    getResourceUrl(resourceKey: string): Promise<string>;
}
export {};

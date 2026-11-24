import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import axios from 'axios';
import { GithubConfigService } from '../github-config/github-config.service.js';

/**
 * GoogleDocsService — Xử lý fetch nội dung từ Google Docs/Drive và URL tùy ý.
 *
 * Chỉ hỗ trợ tài liệu được chia sẻ công khai (không cần OAuth hay API Key).
 * Lấy nội dung mới nhất mỗi lần gọi (không cache).
 */
@Injectable()
export class GoogleDocsService {
  private readonly HTTP_TIMEOUT_MS = 15_000;

  constructor(private readonly githubConfigService: GithubConfigService) {}

  /**
   * Lấy URL Google Docs mặc định từ GithubConfigService (data.json → "link").
   */
  async getDefaultUrl(): Promise<string> {
    return this.githubConfigService.getGoogleDocLink();
  }

  /**
   * Lấy URL Google Docs thứ hai từ GithubConfigService (data.json → "link2").
   */
  async getDefaultUrl2(): Promise<string> {
    return this.githubConfigService.getGoogleDocLink2();
  }

  /**
   * Fetch nội dung từ Google Docs hoặc Google Drive file.
   *
   * Hỗ trợ các dạng URL:
   *  - https://docs.google.com/document/d/{FILE_ID}/edit  → Google Docs
   *  - https://docs.google.com/document/d/{FILE_ID}/...   → Google Docs
   *  - https://drive.google.com/file/d/{FILE_ID}/...      → Google Drive file
   *  - https://drive.google.com/open?id={FILE_ID}         → Google Drive file
   *
   * @param url URL Google Docs hoặc Google Drive đã được chia sẻ công khai
   * @returns Nội dung văn bản của tài liệu
   * @throws BadRequestException nếu URL không hợp lệ hoặc không nhận dạng được
   * @throws InternalServerErrorException nếu không đọc được nội dung
   */
  async fetchDocument(url: string): Promise<string> {
    const exportUrl = this.buildExportUrl(url);
    return this.fetchUrl(exportUrl);
  }

  /**
   * Fetch nội dung từ bất kỳ URL công khai nào.
   * Dùng cho tool get_note và get_resource.
   *
   * @param url URL công khai cần fetch
   * @returns Nội dung văn bản
   */
  async fetchUrl(url: string): Promise<string> {
    try {
      const response = await axios.get<string>(url, {
        timeout: this.HTTP_TIMEOUT_MS,
        responseType: 'text',
        maxRedirects: 5,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; MCP-Server/1.0; +https://github.com)',
        },
        validateStatus: (status) => status < 400,
      });

      const content = response.data;
      if (!content || (typeof content === 'string' && content.trim() === '')) {
        throw new InternalServerErrorException(
          'URL trả về nội dung rỗng. Hãy kiểm tra URL có truy cập được không.',
        );
      }

      return typeof content === 'string' ? content : JSON.stringify(content);
    } catch (error) {
      if (
        error instanceof InternalServerErrorException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 403) {
          throw new BadRequestException(
            'Không có quyền truy cập (403). Hãy đảm bảo tài nguyên được chia sẻ công khai.',
          );
        }
        if (status === 404) {
          throw new BadRequestException(
            'Không tìm thấy tài nguyên (404). Hãy kiểm tra lại URL.',
          );
        }
        throw new InternalServerErrorException(
          `Lỗi HTTP ${String(status ?? 'unknown')} khi fetch: ${error.message}`,
        );
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        `Không thể fetch nội dung: ${message}`,
      );
    }
  }

  /**
   * Chuyển đổi URL chia sẻ Google Docs/Drive thành URL export plain text.
   *
   * @param url URL gốc từ người dùng hoặc data.json
   * @returns URL export phù hợp để fetch nội dung
   * @throws BadRequestException nếu URL không được nhận dạng
   */
  private buildExportUrl(url: string): string {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new BadRequestException(
        `URL không hợp lệ: "${url}". Hãy truyền một URL đầy đủ hợp lệ.`,
      );
    }

    const { hostname, pathname, searchParams } = parsedUrl;

    // Google Docs: docs.google.com/document/d/{FILE_ID}/...
    if (hostname === 'docs.google.com') {
      const match = pathname.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
      if (match?.[1]) {
        const fileId = match[1];
        return `https://docs.google.com/document/d/${fileId}/export?format=txt`;
      }
    }

    // Google Drive: drive.google.com/file/d/{FILE_ID}/...
    if (hostname === 'drive.google.com') {
      const fileMatch = pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileMatch?.[1]) {
        const fileId = fileMatch[1];
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }

      // Google Drive: drive.google.com/open?id={FILE_ID}
      const idParam = searchParams.get('id');
      if (idParam) {
        return `https://drive.google.com/uc?export=download&id=${idParam}`;
      }
    }

    throw new BadRequestException(
      `URL không được nhận dạng: "${url}". Chỉ hỗ trợ Google Docs (docs.google.com) và Google Drive (drive.google.com).`,
    );
  }
}

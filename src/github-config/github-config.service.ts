import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { EXTERNAL_LINKS } from '../config/external-links.js';

/**
 * Cấu trúc đầy đủ của data.json trên GitHub.
 */
interface GithubConfig {
  /** URL cho tool get_google_doc */
  link?: string;
  /** URL thứ hai cho tool get_google_doc_2 */
  link2?: string;
  /** URL cho tool get_note */
  note_link?: string;
  /** Map key → URL cho tool get_resource */
  resources?: Record<string, string>;
}

/**
 * GithubConfigService — Tải và parse file data.json từ GitHub.
 *
 * Mỗi lần gọi đều fetch mới nhất từ GitHub, không cache.
 * Nhờ đó, khi thay đổi data.json trên GitHub, backend tự nhận ngay
 * mà không cần deploy lại.
 */
@Injectable()
export class GithubConfigService {
  private readonly HTTP_TIMEOUT_MS = 10_000;

  /**
   * Tải toàn bộ data.json từ GitHub và trả về object đã parse.
   */
  async fetchConfig(): Promise<GithubConfig> {
    try {
      const response = await axios.get<GithubConfig>(
        EXTERNAL_LINKS.github.configJson,
        { timeout: this.HTTP_TIMEOUT_MS },
      );
      return response.data ?? {};
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        `Không thể tải file cấu hình từ GitHub: ${message}`,
      );
    }
  }

  /**
   * Lấy URL Google Docs mặc định từ trường "link" trong data.json.
   */
  async getGoogleDocLink(): Promise<string> {
    const config = await this.fetchConfig();
    const link = config.link;
    if (!link || typeof link !== 'string') {
      throw new InternalServerErrorException(
        'data.json không có trường "link" hợp lệ.',
      );
    }
    return link;
  }

  /**
   * Lấy URL Google Docs thứ hai từ trường "link2" trong data.json.
   */
  async getGoogleDocLink2(): Promise<string> {
    const config = await this.fetchConfig();
    const link2 = config.link2;
    if (!link2 || typeof link2 !== 'string') {
      throw new InternalServerErrorException(
        'data.json không có trường "link2" hợp lệ.',
      );
    }
    return link2;
  }

  /**
   * Lấy URL nội dung ghi chú từ trường "note_link" trong data.json.
   */
  async getNoteLink(): Promise<string> {
    const config = await this.fetchConfig();
    const noteLink = config.note_link;
    if (!noteLink || typeof noteLink !== 'string') {
      throw new InternalServerErrorException(
        'data.json không có trường "note_link" hợp lệ. ' +
          'Hãy thêm: { "note_link": "https://..." } vào data.json.',
      );
    }
    return noteLink;
  }

  /**
   * Lấy URL tài nguyên theo key từ trường "resources" trong data.json.
   *
   * @param resourceKey Key cần tra cứu trong resources
   */
  async getResourceUrl(resourceKey: string): Promise<string> {
    const config = await this.fetchConfig();
    const resources = config.resources;

    if (!resources || typeof resources !== 'object') {
      throw new InternalServerErrorException(
        'data.json không có trường "resources" hợp lệ. ' +
          'Hãy thêm: { "resources": { "my_key": "https://..." } } vào data.json.',
      );
    }

    const url = resources[resourceKey];
    if (!url || typeof url !== 'string') {
      const availableKeys = Object.keys(resources);
      const keysHint =
        availableKeys.length > 0
          ? `Các key hiện có: ${availableKeys.join(', ')}.`
          : 'Chưa có key nào được cấu hình trong resources.';
      throw new InternalServerErrorException(
        `Không tìm thấy key "${resourceKey}" trong resources của data.json. ${keysHint}`,
      );
    }

    return url;
  }
}
